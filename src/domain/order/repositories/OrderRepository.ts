import { Order, Prisma, PrismaClient } from "@prisma/client";
import { IOrderRepository } from "./IOrderRepository";

export class OrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: Prisma.OrderCreateInput): Promise<Order> {
    return this.prisma.order.create({ data });
  }

  async findById(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({ where: { id } });
  }

  async update(
    id: string,
    data: Prisma.OrderUpdateInput
  ): Promise<Order | null> {
    return this.prisma.order.update({
      where: { id },
      data,
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

  async findMany(params: {
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.Enumerable<Prisma.OrderOrderByWithRelationInput>;
    take?: number;
  }): Promise<Order[]> {
    const { where, orderBy, take } = params;
    return this.prisma.order.findMany({
      where,
      orderBy,
      take,
      include: {
        user: true,
        items: true,
      },
    });
  }

  async findByStatus(status: string): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { status },
      include: {
        user: true,
        items: true,
      },
    });
  }

  async findByTable(): Promise<Order[]> {
    // Note: Si vous avez besoin de filtrer par table, vous devrez peut-être ajouter
    // une relation entre Order et Table dans votre schéma Prisma.
    // Pour l'instant, cette méthode retournera toutes les commandes.
    // Vous pouvez la modifier selon vos besoins spécifiques.
    return this.prisma.order.findMany({
      where: {
        // Ajoutez ici la logique de filtrage par table si nécessaire
      },
      include: {
        user: true,
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        user: true,
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });
  }
}
