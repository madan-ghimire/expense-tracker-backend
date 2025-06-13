import { IExpenseRepository } from "../../domain/repositories/expenseRepository";

export const addExpense =
  (repo: IExpenseRepository) =>
  (data: {
    title: string;
    amount: number;
    category: string;
    userId: string;
  }) => {
    return repo.create(data);
  };
