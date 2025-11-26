"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApiRoutes = void 0;
const express_1 = require("express");
const order_controller_1 = require("../controllers/order/order.controller");
const tsyringe_1 = require("tsyringe");
const setupApiRoutes = () => {
    const router = (0, express_1.Router)();
    const orderController = tsyringe_1.container.resolve(order_controller_1.OrderController);
    const handleRequest = (handler) => async (req, res, next) => {
        try {
            const result = await handler(req, res);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    // Routes pour les commandes
    router.post('/orders', (req, res, next) => handleRequest(() => orderController.create(req.body))(req, res, next));
    router.get('/orders', (req, res, next) => handleRequest(() => orderController.findAll())(req, res, next));
    router.get('/orders/:id', (req, res, next) => handleRequest(() => orderController.findOne(req.params.id))(req, res, next));
    router.put('/orders/:id', (req, res, next) => handleRequest(() => orderController.update(req.params.id, req.body))(req, res, next));
    router.delete('/orders/:id', (req, res, next) => handleRequest(() => orderController.remove(req.params.id))(req, res, next));
    return router;
};
exports.setupApiRoutes = setupApiRoutes;
//# sourceMappingURL=api.routes.js.map