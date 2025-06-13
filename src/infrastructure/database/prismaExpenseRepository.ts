import prisma from "./prismaClient";
import { Expense } from "../../domain/models/Expense";
import { IExpenseRepository } from "../../domain/repositories/expenseRepository";

export class PrismaExpenseRepository implements IExpenseRepository {
  async create(expense: Omit<Expense, "id">): Promise<Expense> {
    return await prisma.expense.create({ data: expense });
  }

  async findAllByUser(userId: string): Promise<Expense[]> {
    return await prisma.expense.findMany({ where: { userId } });
  }

  async deleteById(id: string): Promise<void> {
    await prisma.expense.delete({ where: { id } });
  }
}
