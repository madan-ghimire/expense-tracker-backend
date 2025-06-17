import { PrismaClient } from "@prisma/client";
import { AppError } from "../../domain/errors/AppError";
import { hashPassword, verifyPassword } from "../../utils/hash";
import {
  generateToken,
  generateResetToken,
  verifyResetToken,
} from "../../utils/jwt";
import { passwordResetTemplate } from "../../utils/emailTemplates";
import { SignupDto, SigninDto } from "@/presentation/dtos/auth.dto";
import bcrypt from "bcrypt";
import { resend } from "../../config/resend";

const prisma = new PrismaClient();

export const register = async (data: SignupDto) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const hashed = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      displayName: `${data.firstName} ${data.lastName}`,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      role: "USER",
    },
  });

  return generateToken(user.id, user.role);
};

export const signin = async (data: SigninDto) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  if (user && (await bcrypt.compare(data.password, user.password))) {
    return generateToken(user.id, user.role);
  }
  throw new AppError("Invalid credentials", 401);
};

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError("Email not found", 404);
  }

  const token = generateResetToken(user.id);
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: passwordResetTemplate(resetUrl),
  });

  return { message: "Reset email sent" };
};

export const resetPassword = async (token: string, newPassword: string) => {
  let payload;
  try {
    payload = verifyResetToken(token);
  } catch {
    throw new AppError("Invalid or expired token", 400);
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  if (typeof payload === "object" && payload !== null && "userid" in payload) {
    await prisma.user.update({
      where: { id: (payload as any).userid },
      data: { password: hashed },
    });
  } else {
    throw new Error("Invalid token");
  }

  return { message: "Password updated successfully" };
};

export const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  if (newPassword !== confirmPassword) {
    throw new AppError("Passwords do not match", 400);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404);

  const isMatch = await verifyPassword(oldPassword, user.password);
  if (!isMatch) throw new AppError("Old password is incorrect", 401);

  const hashed = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });

  return { message: "Password changed successfully" };
};
