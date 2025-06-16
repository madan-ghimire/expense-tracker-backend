import { PrismaClient } from "@prisma/client";
import { AppError } from "../../domain/errors/AppError";
import { hashPassword, verifyPassword } from "../../utils/hash";
import { generateToken } from "../../utils/jwt";
import { SignupDto, SigninDto } from "@/presentation/dtos/auth.dto";
import bcrypt from "bcrypt";

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
