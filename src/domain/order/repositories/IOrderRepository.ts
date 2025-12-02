import { Order, Prisma, OrderStatus } from '@prisma/client';

export interface IOrderRepository {
  create(data: Prisma.OrderCreateInput): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  update(id: string, data: Prisma.OrderUpdateInput): Promise<Order | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<Order[]>;
  findMany(params: {
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.Enumerable<Prisma.OrderOrderByWithRelationInput>;
    take?: number;
  }): Promise<Order[]>;
  findByStatus(status: OrderStatus): Promise<Order[]>;
  findByTable(tableNumber: string): Promise<Order[]>;
  findByUser(userId: string): Promise<Order[]>;
}
