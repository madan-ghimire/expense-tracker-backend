import { Request, Response, NextFunction } from "express";

import { addExpense } from "../../application/user-cases/addExpense";
import { PrismaExpenseRepository } from "@/infrastructure/database/prismaExpenseRepository";

const repo = new PrismaExpenseRepository();

export const createExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, amount, category, userId } = req.body;
    const expense = await addExpense(repo)({ title, amount, category, userId });
    res.status(201).json(expense);
  } catch (error) {
    // console.error("check error", error);
    // res.status(500).json({ message: "Error creating expense", error });
    next(error); // 👈 forward to error middleware
  }
};
