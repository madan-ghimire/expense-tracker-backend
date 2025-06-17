import { IGenericRepository } from "../../../shared/repositories/IGenericRepository";

export class BaseRepository<T> implements IGenericRepository<T> {
  constructor(protected readonly prismaModel: any) {}

  async create(data: T): Promise<T> {
    return this.prismaModel.create({ data });
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.prismaModel.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prismaModel.delete({ where: { id } });
  }

  async findById(id: string): Promise<T | null> {
    return this.prismaModel.findUnique({ where: { id } });
  }

  async findAll(): Promise<T[]> {
    return this.prismaModel.findMany();
  }
}
