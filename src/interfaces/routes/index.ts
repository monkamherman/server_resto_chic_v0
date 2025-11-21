import { Router } from 'express';
import { setupApiRoutes } from './api.routes';

const router = Router();

// Route de santé
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Routes d'API
router.use('/api', setupApiRoutes());

export default router;
