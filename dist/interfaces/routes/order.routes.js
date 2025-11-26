"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = require("express");
const order_controller_1 = require("../controllers/order/order.controller");
const tsyringe_1 = require("tsyringe");
const orderRoutes = () => {
    const router = (0, express_1.Router)();
    const orderController = tsyringe_1.container.resolve(order_controller_1.OrderController);
    // Routes pour les commandes
    router.post('/', (req, res) => orderController.create(req.body).then(response => res.json(response)));
    router.get('/', (req, res) => orderController.findAll().then(response => res.json(response)));
    router.get('/:id', (req, res) => orderController.findOne(req.params.id).then(response => res.json(response)));
    router.put('/:id', (req, res) => orderController.update(req.params.id, req.body).then(response => res.json(response)));
    router.delete('/:id', (req, res) => orderController.remove(req.params.id).then(response => res.json(response)));
    return router;
};
exports.orderRoutes = orderRoutes;
//# sourceMappingURL=order.routes.js.map