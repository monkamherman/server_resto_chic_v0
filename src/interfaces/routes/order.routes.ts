import { Router } from 'express';
import { OrderController } from '../controllers/order/order.controller';
import { container } from 'tsyringe';

export const orderRoutes = (): Router => {
  const router = Router();
  const orderController = container.resolve(OrderController);

  // Routes pour les commandes
  router.post('/', (req, res) => orderController.create(req.body).then(response => res.json(response)));
  router.get('/', (req, res) => orderController.findAll().then(response => res.json(response)));
  router.get('/:id', (req, res) => orderController.findOne(req.params.id).then(response => res.json(response)));
  router.put('/:id', (req, res) => orderController.update(req.params.id, req.body).then(response => res.json(response)));
  router.delete('/:id', (req, res) => orderController.remove(req.params.id).then(response => res.json(response)));

  return router;
};
