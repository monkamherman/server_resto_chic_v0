import { Request, Response } from 'express';
import { OrderStatus, Prisma } from '@prisma/client';
import { OrderService } from '@domain/order/services/order.service';
import { CreateOrderDto, UpdateOrderDto, UpdateOrderStatusDto } from '@domain/order/dtos';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { IOrderRepository } from '@domain/order/repositories/IOrderRepository';

interface ErrorWithMessage extends Error {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

export class OrderController {
  private orderService: OrderService;

  constructor() {
    // Le repository sera injecté via setRepository ou via l'application
    this.orderService = new OrderService({} as IOrderRepository);
  }

  async findAll(_req: Request, res: Response) {
    try {
      const orders = await this.orderService.findAll();
      res.json({
        success: true,
        data: orders,
        count: orders.length
      });
    } catch (error) {
      const errorMessage = isErrorWithMessage(error) 
        ? error.message 
        : 'Erreur lors de la récupération des commandes';
      
      res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  }

  // Définir une méthode pour définir le repository (utilisée pour les tests)
  public setRepository(repository: IOrderRepository) {
    this.orderService = new OrderService(repository);
  }

  public async create(req: Request, res: Response) {
    try {
      // Convertir et valider les données de la requête
      const createOrderDto = plainToInstance(CreateOrderDto, req.body);
      await validateOrReject(createOrderDto);
      
      // Convertir le DTO en format attendu par le service
      const orderData = {
        ...createOrderDto,
        user: { connect: { id: createOrderDto.userId } },
        items: {
          create: createOrderDto.items.map(item => ({
            dishId: item.dishId,
            quantity: item.quantity,
            price: item.unitPrice,
            notes: item.notes
          }))
        }
      
      const order = await this.orderService.create(orderData);
      
      res.status(201).json({
        success: true,
        data: order,
        message: 'Commande créée avec succès'
      });
    } catch (error) {
      const errorMessage = isErrorWithMessage(error) ? error.message : 'Erreur lors de la création de la commande';
      res.status(400).json({ 
        success: false,
        message: errorMessage,
        errors: error instanceof Array ? error : undefined
      });
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const updateOrderDto = plainToInstance(UpdateOrderDto, req.body);
      await validateOrReject(updateOrderDto);
      
      const updateData: Prisma.OrderUpdateInput = {
        ...updateOrderDto,
        items: updateOrderDto.items ? {
          deleteMany: {},
          create: updateOrderDto.items.map(item => ({
            dishId: item.dishId,
            quantity: item.quantity,
            price: item.unitPrice,
            notes: item.notes
          }))
        } : undefined
      };
      
      const order = await this.orderService.update(req.params.id, updateData);
      
      res.json({
        success: true,
        data: order,
        message: 'Commande mise à jour avec succès'
      });
    } catch (error) {
      const errorMessage = isErrorWithMessage(error) ? error.message : 'Erreur lors de la mise à jour de la commande';
      res.status(400).json({ 
        success: false,
        message: errorMessage,
        errors: error instanceof Array ? error : undefined
      });
    }
  }

  public async updateStatus(req: Request, res: Response) {
    try {
      const updateStatusDto = plainToInstance(UpdateOrderStatusDto, req.body);
      await validateOrReject(updateStatusDto);
      
      const order = await this.orderService.update(req.params.id, {
        status: updateStatusDto.status
      });
      
      res.json({
        success: true,
        data: order,
        message: 'Statut de la commande mis à jour avec succès'
      });
    } catch (error) {
      const errorMessage = isErrorWithMessage(error) ? error.message : 'Erreur lors de la mise à jour du statut de la commande';
      res.status(400).json({ 
        success: false,
        message: errorMessage,
        errors: error instanceof Array ? error : undefined
      });
    }
  }

  public async getUserOrders(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { status } = req.query;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'L\'ID utilisateur est requis'
        });
      }
      
      const where: Prisma.OrderWhereInput = { userId };
      
      if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
        where.status = status as OrderStatus;
      }
      
      const orders = await this.orderService.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 50
      });
      
      res.json({
        success: true,
        data: orders,
        count: Array.isArray(orders) ? orders.length : 0
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes de l\'utilisateur:', error);
      const errorMessage = isErrorWithMessage(error) 
        ? error.message 
        : 'Erreur lors de la récupération des commandes par utilisateur';
      
      res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  }
