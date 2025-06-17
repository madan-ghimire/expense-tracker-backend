import { PrismaClient } from "@prisma/client";
import { IUnitOfWork } from "../../../shared/unit-of-work/IUnitOfWork";

export class PrismaUnitOfWork implements IUnitOfWork {
  constructor(private readonly prisma: PrismaClient) {}

  async complete(): Promise<void> {
    await this.prisma.$transaction(async () => {
      // Transaction logic here if needed
    });
  }

  async rollback(): Promise<void> {
    // Not natively supported in Prisma, leave empty or log
  }
}
