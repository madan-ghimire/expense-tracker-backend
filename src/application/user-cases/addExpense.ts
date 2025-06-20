import { Expense } from "@prisma/client";
import { IExpenseRepository } from "../../domain/expense/repositories/IExpenseRepository";

export const addExpense = async (
  repo: IExpenseRepository,
  data: Omit<Expense, "id">
) => {
  return await repo.create(data);
};
