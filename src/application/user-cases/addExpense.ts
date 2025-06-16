import { IExpenseRepository } from "../../domain/expense/repositories/IExpenseRepository";

interface AddExpenseInput {
  title: string;
  amount: number;
  category: string;
  userId: string;
  createdAt: Date;
}

export const addExpense = async (
  repo: IExpenseRepository,
  data: AddExpenseInput
) => {
  return await repo.create(data);
};
