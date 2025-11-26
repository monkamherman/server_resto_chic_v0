import express from "express";
import auth from "./auth.routes";
import user from "./route";

const app = express();

export default function registerRoutes(app: express.Application) {
  app.use("/api/user", user);
  app.use("/api/auth", auth);
}
