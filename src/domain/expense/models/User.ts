export type Role = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  username: string;
  loginEnabled: boolean;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  displayName: string;
  password: string;
  role: Role;
  isActive: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  Expense: unknown[];
}
