import { Expense } from "../models/Expense";

export interface IExpenseRepository {
  create(expense: Omit<Expense, "id">): Promise<Expense>;
  findAllByUser(userId: string): Promise<Expense[]>;
  deleteById(id: string): Promise<void>;
}
