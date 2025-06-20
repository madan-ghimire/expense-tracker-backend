import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../domain/errors/AppError";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

const prismaErrorMessages: Record<string, string> = {
  P1000: "Authentication failed against the database.",
  P1001: "Database server unreachable. Is it running?",
  P1002: "Database operation timed out.",
  P1003: "Unsupported database version.",
  P1008: "Operation aborted due to DB connection failure.",
  P1009: "Command was interrupted.",
  P1010: "User authentication failed.",
  P1011: "TLS connection error.",
  P1012: "Database does not exist.",
  P1013: "Invalid Prisma schema.",
  P1014: "Migration failed.",
  P1015: "Schema out of sync. Run `prisma db pull`.",
  P1016: "Unapplied migrations detected.",
  P2000: "Value too long for column.",
  P2001: "Record not found.",
  P2002: "Unique constraint violation.",
  P2003: "Foreign key constraint failed.",
  P2004: "Database constraint failed.",
  P2005: "Invalid value for column.",
  P2006: "Invalid field type value.",
  P2007: "Invalid data in database.",
  P2008: "Invalid query.",
  P2009: "Invalid query result.",
  P2010: "Raw query execution failed.",
  P2011: "Null constraint violation.",
  P2012: "Missing required argument.",
  P2013: "Invalid argument value.",
  P2014: "Relationship constraint failed.",
  P2015: "Related record not found.",
  P2016: "Query interpretation error.",
  P2017: "Required records not found.",
  P2018: "DB connection not found.",
  P2019: "Invalid query input.",
  P2020: "Operation aborted due to conflict.",
  P2021: "Requested resource not found.",
  P2022: "Data integrity violation.",
  P2023: "Resource is in use.",
  P2024: "Database connection lost.",
};

function getErrorMessage(code: string): string {
  return (
    prismaErrorMessages[code] ||
    "An unexpected database error occurred. Contact the system administrator."
  );
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("🛑 Error occurred:", err);

  // JWT Token Expired
  if (err.name === "TokenExpiredError") {
    res.status(401).json({ error: "Token has expired. Please log in again." });
  }

  // ✅ JWT Invalid Token
  if (err.name === "JsonWebTokenError") {
    res.status(401).json({ error: "Invalid token. Authentication failed." });
  }

  // ✅ Handle Zod validation errors (NEW)r
  if (err instanceof ZodError) {
    const flattened = err.flatten();
    res.status(400).json({
      error: "Validation failed",
      issues: {
        fieldErrors: flattened.fieldErrors,
        formErrors: flattened.formErrors,
      },
    });
    return;
  }

  // ✅ Handle Prisma known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const code = err.code;
    const message = getErrorMessage(code);
    res.status(400).json({ error: message, code });
    return;
  }

  // ✅ Handle Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    console.error("🛑 Prisma Validation Error:", err.message);
    res.status(400).json({
      error:
        "Validation failed. Please ensure all required fields are provided.",
      details: err.message, // Optional: include message for dev
    });
  }

  // ✅ Handle custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // ✅ Fallback for unknown errors
  res.status(500).json({
    error: "Internal server error. Please try again later.",
  });
};
