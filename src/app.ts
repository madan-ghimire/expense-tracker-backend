import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import expenseRoutes from "./presentation/routes/expenseRoutes";
import type { Express, Request, Response } from "express";
import { errorHandler } from "./middlewares/errorHandler";
import swaggerUi from "swagger-ui-express";
import { swaggerOptions } from "./infrastructure/config/swagger";
import swaggerJSDoc from "swagger-jsdoc";
import authRoutes from "./presentation/routes/authRoutes";
import { logRequests } from "./middlewares/loggerMiddleware";

const createApp = (): Express => {
  const app = express();

  app.use(logRequests);
  // ✅ Create path to ../logs/access.log
  const logPath = path.join(__dirname, "..", "logs", "access.log");
  // Ensure log directory exists
  fs.mkdirSync(path.dirname(logPath), { recursive: true });

  // Create a write stream
  const accessLogStream = fs.createWriteStream(logPath, { flags: "a" });

  // Use Morgan to log to file
  app.use(morgan("combined", { stream: accessLogStream }));

  // Modern middleware setup
  app.use(express.json({ limit: "10mb" }));

  const specs = swaggerJSDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

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

  app.use(expenseRoutes);

  app.use(authRoutes);

  app.use(errorHandler);

  return app;
};

export default createApp;
