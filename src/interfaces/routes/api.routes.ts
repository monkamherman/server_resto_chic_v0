import { Router } from 'express';
import { OrderController } from '../controllers/order/order.controller';
import { container } from 'tsyringe';

export const setupApiRoutes = (): Router => {
  const router = Router();
  const orderController = container.resolve(OrderController);

  // Routes pour les commandes
  router.post('/orders', (req, res) => orderController.create(req, res));
  router.get('/orders', (req, res) => orderController.findAll(req, res));
  router.get('/orders/:id', (req, res) => orderController.findOne(req, res));
  router.put('/orders/:id', (req, res) => orderController.update(req, res));
  router.delete('/orders/:id', (req, res) => orderController.remove(req, res));

  return router;
};
