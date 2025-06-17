import { Request, Response, NextFunction } from "express";
import * as authService from "../../application/services/authService";
import { User } from "@/domain/expense/models/User";
import { SigninDto, SignupSchema } from "../dtos/auth.dto";
import { AppError } from "@/domain/errors/AppError";
import { requestPasswordReset } from "../../application/services/authService";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

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

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await authService.signin(req.body as SigninDto);
    res.status(200).json({ message: "Authentication successful", token });
  } catch (error) {
    next(error); // 👈 forward to error middleware
  }
};

export const handleRequestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  const result = await requestPasswordReset(email);
  res.json(result);
};

export const handleChangePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.user;

  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!user?.id) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const result = await authService.changePassword(
      user.id,
      oldPassword,
      newPassword,
      confirmPassword
    );

    res.status(200).json(result);
  } catch (error) {
    next(error); // forward the error to your global error middleware
  }
};
