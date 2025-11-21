import { Order, Prisma } from '@prisma/client';

export interface IOrderRepository {
  create(data: Prisma.OrderCreateInput): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  update(id: string, data: Prisma.OrderUpdateInput): Promise<Order | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<Order[]>;
}
