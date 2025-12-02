import { CreateOrderDto } from "@domain/order/dtos/create-order.dto";
import { UpdateOrderStatusDto } from "@domain/order/dtos/update-order-status.dto";
import { UpdateOrderDto } from "@domain/order/dtos/update-order.dto";
import { OrderStatus } from "@domain/order/entities/order.entity";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";
import { OrderController } from "../../controllers/order.controller";

// Interface pour étendre l'objet Request avec la propriété validatedBody
interface CustomRequest<T = unknown> extends Request {
  validatedBody?: T;
}

export const orderRoutes = (): Router => {
  const router = Router();
  const orderController = new OrderController();

  // Middleware de validation pour la création de commande
  const validateCreateOrder = async (
    req: CustomRequest<CreateOrderDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = plainToInstance(CreateOrderDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Erreur de validation",
          errors: errors.map((err) => ({
            property: err.property,
            constraints: err.constraints,
          })),
        });
      }
      req.validatedBody = dto;
      next();
    } catch (error) {
      next(error);
    }
  };

  // Middleware de validation pour la mise à jour de commande
  const validateUpdateOrder = async (
    req: CustomRequest<UpdateOrderDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = plainToInstance(UpdateOrderDto, req.body);
      const errors = await validate(dto, { skipMissingProperties: true });
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Erreur de validation",
          errors: errors.map((err) => ({
            property: err.property,
            constraints: err.constraints,
          })),
        });
      }
      req.validatedBody = dto;
      next();
    } catch (error) {
      next(error);
    }
  };

  // Middleware de validation pour la mise à jour du statut
  const validateUpdateStatus = async (
    req: CustomRequest<UpdateOrderStatusDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = plainToInstance(UpdateOrderStatusDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Erreur de validation",
          errors: errors.map((err) => ({
            property: err.property,
            constraints: err.constraints,
          })),
        });
      }
      req.validatedBody = dto;
      next();
    } catch (error) {
      next(error);
    }
  };

  // Routes pour les commandes

  // Créer une nouvelle commande
  router.post("/", validateCreateOrder, orderController.create);

  // Récupérer toutes les commandes (avec filtrage optionnel par statut)
  router.get("/", (req: Request, res: Response) => {
    const orderController = new OrderController();
    return orderController.findAll(req, res);
  });

  // Récupérer une commande par son ID
  router.get("/:id", orderController.findOne);

  // Mettre à jour une commande
  router.put("/:id", validateUpdateOrder, orderController.update);

  // Supprimer une commande

  // Mettre à jour le statut d'une commande
  router.patch(
    "/:id/status",
    validateUpdateStatus,
    orderController.updateStatus
  );

  // Récupérer les commandes par statut
  router.get("/status/:status", (async (req: Request, res: Response) => {
    try {
      const { status } = req.params as { status: string };
      if (
        !status ||
        !Object.values(OrderStatus).includes(status as OrderStatus)
      ) {
        return res.status(400).json({
          success: false,
          message: "Statut de commande invalide",
          validStatuses: Object.values(OrderStatus),
        });
      }
      await orderController.getByStatus(req, res);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      res.status(500).json({
        success: false,
        message: `Erreur lors de la récupération des commandes par statut: ${errorMessage}`,
      });
    }
  }) as RequestHandler);

  // Récupérer les commandes par table
  router.get("/table/:tableNumber", (async (req: Request, res: Response) => {
    try {
      const { tableNumber } = req.params as { tableNumber: string };
      if (!tableNumber) {
        return res.status(400).json({
          success: false,
          message: "Le numéro de table est requis",
        });
      }
      await orderController.getByTable(req, res);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      res.status(500).json({
        success: false,
        message: `Erreur lors de la récupération des commandes par table: ${errorMessage}`,
      });
    }
  }) as RequestHandler);

  // Récupérer les commandes par utilisateur
  router.get("/user/:userId", (async (req: Request, res: Response) => {
    try {
      const { userId } = req.params as { userId: string };
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "L'ID utilisateur est requis",
        });
      }
      await orderController.getByUser(req, res);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      res.status(500).json({
        success: false,
        message: `Erreur lors de la récupération des commandes par utilisateur: ${errorMessage}`,
      });
    }
  }) as RequestHandler);

  return router;
};
