import { Request, Response, NextFunction } from "express";
import * as authService from "../../application/services/authService";
import { User } from "@/domain/expense/models/User";
import { SignupSchema } from "../dtos/auth.dto";
import { AppError } from "@/domain/errors/AppError";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationResult = SignupSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw validationResult.error;
    }

    const token = await authService.register(req.body as User);
    res.status(201).json({ token });
  } catch (error) {
    next(error); // 👈 forward to error middleware
  }
};
