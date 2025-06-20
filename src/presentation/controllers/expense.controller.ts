import { Request, Response, NextFunction, response } from "express";

import { addExpense } from "../../application/user-cases/addExpense";
import { PrismaExpenseRepository } from "../../infrastructure/database/repositories/PrismaExpenseRepository";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();
const expenseRepo = new PrismaExpenseRepository(prisma);

export const createExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("📥 Expense creation request received:", req.body);
    const { title, amount, category, userId, createdAt } = req.body;
    const expense = await addExpense(expenseRepo, {
      title,
      amount,
      category,
      userId,
      createdAt,
    });

    // ✅ send webhook event after expense is created
    try {
      await axios.post("http://localhost:8080/api/webhook", {
        type: "expense.created",
        data: expense,
      });
      console.log("📡 Webhook sent successfully.");
    } catch (webhookError: any) {
      console.error("❌ Failed to send webhook:", webhookError.message);
    }

    res.status(201).json(expense);
  } catch (error) {
    next(error); // 👈 forward to error middleware
  }
};

export const getAllExpenses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const expenses = await expenseRepo.findAll();
    console.log("all expenses", expenses);
    res.status(200).json(expenses);
  } catch (error) {
    next(error);
  }
};

export const getExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Expense ID is required" });
    }

    const expense = await expenseRepo.findById(id);

    if (!expense) {
      return res
        .status(404)
        .json({ message: `Expense with ID '${id}' does not exist` });
    }

    return res.status(200).json(expense);
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ message: "Expense ID is required" });
    }

    const updated = await expenseRepo.update(id, updateData);
    if (!updateData) {
      return res
        .status(404)
        .json({ message: `Expense with ID '${id}' not found` });
    }
    return res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Expense ID is required" });
    }

    const existing = await expenseRepo.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json({ message: `Expense with ID '${id}' does not exist` });
    }

    await expenseRepo.delete(id);
    return res.status(204).send(); // No Content
  } catch (error) {
    next(error);
  }
};
