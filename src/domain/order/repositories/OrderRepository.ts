import { PrismaClient, Order } from '@prisma/client';
import { IOrderRepository } from './IOrderRepository';
import { Prisma } from '@prisma/client';

export class OrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: Prisma.OrderCreateInput): Promise<Order> {
    return this.prisma.order.create({ data });
  }

  async findById(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.OrderUpdateInput): Promise<Order | null> {
    return this.prisma.order.update({ 
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.order.delete({ where: { id } });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findAll(): Promise<Order[]> {
    return this.prisma.order.findMany();
  }
}
