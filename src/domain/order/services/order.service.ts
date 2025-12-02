import { Injectable } from "@nestjs/common";
import { OrderStatus, Prisma } from "@prisma/client";
import { Order } from "../entities/order.entity";
import { IOrderRepository } from "../repositories/IOrderRepository";

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async create(orderData: Prisma.OrderCreateInput) {
    return this.orderRepository.create(orderData);
  }

  async findAll() {
    return this.orderRepository.findAll();
  }

  async findOne(id: string) {
    return this.orderRepository.findById(id);
  }

  async update(id: string, updateData: Prisma.OrderUpdateInput) {
    return this.orderRepository.update(id, updateData);
  }

  async remove(id: string): Promise<boolean> {
    return this.orderRepository.delete(id);
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    return this.orderRepository.findByStatus(status);
  }

  async findByTable(tableNumber: string): Promise<Order[]> {
    return this.orderRepository.findByTable(tableNumber);
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.orderRepository.findByUser(userId);
  }

  async findMany(params: {
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.Enumerable<Prisma.OrderOrderByWithRelationInput>;
    take?: number;
  }): Promise<Order[]> {
    return this.orderRepository.findMany(params);
  }
}
