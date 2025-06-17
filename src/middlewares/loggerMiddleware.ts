import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger"; // adjust path as needed

export const logRequests = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
};
