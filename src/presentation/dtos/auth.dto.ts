import { z } from "zod";

export const SignupSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .max(100, "Email cannot exceed 100 characters")
    .refine((email) => {
      const domain = email.split("@")[1];
      return domain && domain.includes(".");
    }, "Email must contain a valid domain extension (e.g., .com, .org)"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(
      /^[a-zA-Z0-9_.-]*$/,
      "Username can only include letters, numbers, underscores, hyphens, and periods"
    ),

  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "First name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Last name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password cannot exceed 50 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter (A-Z)")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter (a-z)")
    .regex(/[0-9]/, "Password must contain at least one number (0-9)")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character (!@#$%^&*)"
    )
    .refine(
      (password) => !/\s/.test(password),
      "Password cannot contain spaces"
    ),
});

export type SignupDto = z.infer<typeof SignupSchema>;

export const SigninDto = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .max(100, "Email cannot exceed 100 characters"),

  password: z.string().min(1, "Password is required"),
});

export type SigninDto = z.infer<typeof SigninDto>;
