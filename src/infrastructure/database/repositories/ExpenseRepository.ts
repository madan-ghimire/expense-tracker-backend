import { Expense } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";
import { PrismaClient } from "@prisma/client";

export class ExpenseRepository extends BaseRepository<Expense> {
  constructor(private readonly prisma: PrismaClient) {
    super(prisma.expense);
  }

  async create(expense: Omit<Expense, "id">): Promise<Expense> {
    return super.create(expense as Expense);
  }

  async findByUser(userId: string): Promise<Expense[]> {
    return this.prisma.expense.findMany({ where: { userId } });
  }

  async findAll(): Promise<Expense[]> {
    return super.findAll();
  }

  async findById(id: string): Promise<Expense | null> {
    return this.prisma.expense.findUnique({ where: { id } });
  }
}
