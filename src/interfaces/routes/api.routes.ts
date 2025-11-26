import { Router, Request, Response, NextFunction } from 'express';
import { OrderController } from '../controllers/order/order.controller';
import { container } from 'tsyringe';

export const setupApiRoutes = (): Router => {
  const router = Router();
  const orderController = container.resolve(OrderController);

  // Middleware pour gérer les requêtes
  type RequestHandler<T = unknown> = (req: Request, res: Response) => Promise<T>;
  
  const handleRequest = (handler: RequestHandler) => 
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await handler(req, res);
        res.json(result);
      } catch (error) {
        next(error);
      }
    };

  // Routes pour les commandes
  router.post('/orders', (req, res, next) => 
    handleRequest(() => orderController.create(req.body))(req, res, next)
  );
  
  router.get('/orders', (req, res, next) => 
    handleRequest(() => orderController.findAll())(req, res, next)
  );
  
  router.get('/orders/:id', (req, res, next) => 
    handleRequest(() => orderController.findOne(req.params.id))(req, res, next)
  );
  
  router.put('/orders/:id', (req, res, next) => 
    handleRequest(() => orderController.update(req.params.id, req.body))(req, res, next)
  );
  
  router.delete('/orders/:id', (req, res, next) => 
    handleRequest(() => orderController.remove(req.params.id))(req, res, next)
  );

  return router;
};
