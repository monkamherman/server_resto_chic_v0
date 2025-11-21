import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '../repositories/IOrderRepository';
import { Prisma } from '@prisma/client';

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

  async remove(id: string) {
    return this.orderRepository.delete(id);
  }
}
