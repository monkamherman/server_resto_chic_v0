"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const user_role_enum_1 = require("@domain/users/enums/user-role.enum");
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const user_controller_1 = require("../controllers/user/user.controller");
// Wrapper pour gérer les promesses et les erreurs
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
const userRoutes = () => {
    const router = (0, express_1.Router)();
    const userController = tsyringe_1.container.resolve(user_controller_1.UserController);
    // Routes pour les utilisateurs
    router.post("/", asyncHandler(async (req, res) => {
        const result = await userController.create(req.body);
        res.status(201).json(result);
    }));
    router.get("/", asyncHandler(async (req, res) => {
        const isActive = req.query.isActive
            ? req.query.isActive === "true"
            : undefined;
        const role = req.query.role;
        const result = await userController.findAll(isActive, role);
        res.json(result);
    }));
    router.get("/profile", (async (req, res, next) => {
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
        }
        catch (error) {
            next(error);
        }
    }));
    router.get("/:id", async (req, res, next) => {
        try {
            const result = await userController.findOne(req.params.id);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    });
    router.put("/:id", async (req, res, next) => {
        try {
            if (req.user?.role !== user_role_enum_1.UserRole.ADMIN &&
                req.user?.id !== req.params.id) {
                res.status(403).json({ message: "Non autorisé" });
                return;
            }
            const result = await userController.update(req.params.id, req.body, { user: { role: req.user.role, userId: req.user.id } });
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    });
    router.delete("/:id", async (req, res, next) => {
        try {
            if (req.user?.role !== user_role_enum_1.UserRole.ADMIN) {
                res.status(403).json({ message: "Non autorisé" });
                return;
            }
            await userController.remove(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    });
    // Middleware de gestion des erreurs
    router.use((err, req, res) => {
        console.error("Erreur dans la route utilisateur:", err);
        const status = "status" in err ? err.status : 500;
        res.status(status).json({
            message: err.message ||
                "Une erreur est survenue lors du traitement de la requête",
        });
    });
    return router;
};
exports.userRoutes = userRoutes;
//# sourceMappingURL=user.routes.js.map