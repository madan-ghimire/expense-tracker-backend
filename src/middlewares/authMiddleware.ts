import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("check token here", token);

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    (req as any).user = decoded;
    next();
  } catch {
    res.status(403).json({ message: "Auauthorized" });
    return;
  }
};
