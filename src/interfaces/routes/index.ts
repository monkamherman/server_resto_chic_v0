import { Router } from "express";
import userRoutes from "./user.routes";

const router = Router();

// Route de santé
router.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Routes d'API
router.use("/api/users", userRoutes);

export default router;
