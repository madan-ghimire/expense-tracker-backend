import express from "express";
import type { Express, Request, Response } from "express";

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

  return app;
};

export default createApp;
