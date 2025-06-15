import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";

export const generateToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role }, SECRET_KEY, { expiresIn: "1h" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET_KEY);
};
