import { UserRole } from "@domain/users/enums/user-role.enum";
import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/user/user.controller";

// Alias pour la compatibilité
interface AuthenticatedRequest extends UserRequest {}

// Type pour la requête avec utilisateur authentifié
interface UserRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    [key: string]: unknown;
  };
}

// Wrapper pour gérer les promesses et les erreurs
const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req: UserRequest, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const userRoutes = (): Router => {
  const router = Router();
  const userController = container.resolve(UserController);

  // Routes pour les utilisateurs
  router.post(
    "/",
    asyncHandler(async (req, res) => {
      const result = await userController.create(req.body);
      res.status(201).json(result);
    })
  );

  router.get(
    "/",
    asyncHandler(async (req, res) => {
      const isActive = req.query.isActive
        ? req.query.isActive === "true"
        : undefined;
      const role = req.query.role as UserRole | undefined;
      const result = await userController.findAll(isActive, role);
      res.json(result);
    })
  );

  router.get("/profile", (async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Non autorisé" });
        return;
      }

      const result = await userController.getProfile({
        user: {
          userId: req.user.id,
        },
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }) as RequestHandler);

  router.get(
    "/:id",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await userController.findOne(req.params.id);
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  router.put(
    "/:id",
    async (
      req: AuthenticatedRequest & { params: { id: string } },
      res: Response,
      next: NextFunction
    ) => {
      try {
        if (
          req.user?.role !== UserRole.ADMIN &&
          req.user?.id !== req.params.id
        ) {
          res.status(403).json({ message: "Non autorisé" });
          return;
        }

        const result = await userController.update(req.params.id, req.body, { user: { role: req.user.role, userId: req.user.id } });
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  router.delete(
    "/:id",
    async (
      req: AuthenticatedRequest & { params: { id: string } },
      res: Response,
      next: NextFunction
    ) => {
      try {
        if (req.user?.role !== UserRole.ADMIN) {
          res.status(403).json({ message: "Non autorisé" });
          return;
        }

        await userController.remove(req.params.id);
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    }
  );

  // Middleware de gestion des erreurs
  router.use((err: Error, req: Request, res: Response) => {
    console.error("Erreur dans la route utilisateur:", err);
    const status = "status" in err ? (err as { status: number }).status : 500;
    res.status(status).json({
      message:
        err.message ||
        "Une erreur est survenue lors du traitement de la requête",
    });
  });

  return router;
};
