import { Expense } from "@prisma/client";

export interface IExpenseRepository {
  create(expense: Omit<Expense, "id">): Promise<Expense>;
  findByUser(userId: string): Promise<Expense[]>;
}
