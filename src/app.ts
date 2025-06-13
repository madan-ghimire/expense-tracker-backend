import express from "express";
import expenseRoutes from "./presentation/routes/expenseRoutes";
import type { Express, Request, Response } from "express";
import { errorHandler } from "./middleware/errorHandler";
import { setupSwagger } from "@/docs/swagger";

const createApp = (): Express => {
  const app = express();

  // Modern middleware setup
  app.use(express.json({ limit: "10mb" }));

  // simple health check route
  app.get("/api/health", (req: Request, res: Response) => {
    res.status(200).json({
      status: "success",
      message: "🚀 Expense Tracker API is up and running!",
    });
  });

  app.get("/api/users", (req: Request, res: Response) => {
    res.json([
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
    ]);
  });

  app.use("/api", expenseRoutes);

  setupSwagger(app);

  app.use(errorHandler);

  return app;
};

export default createApp;
