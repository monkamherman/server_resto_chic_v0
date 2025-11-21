import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Put, 
  UseGuards,
} from '@nestjs/common';
import { OrderService } from '../../../domain/order/services/order.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../../../infrastructure/security/guards/jwt-auth.guard';
import { Roles } from '../../../infrastructure/security/decorators/roles.decorator';
import { UserRole } from '../../../domain/users/enums/user-role.enum';

interface OrderResponse {
  id: string;
  user_id: string | null;
  status: string;
  total_amount: number;
  coupon_code: string | null;
  discount_amount: number;
  final_amount: number;
  created_at: string;
  updated_at: string;
}


@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  async create(@Body() orderData: Prisma.OrderCreateInput): Promise<OrderResponse> {
    const order = await this.orderService.create(orderData);
    
    return this.mapToOrderResponse(order);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  async findAll(): Promise<OrderResponse[]> {
    const orders = await this.orderService.findAll();
    return orders.map(order => this.mapToOrderResponse(order));
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER)
  async findOne(@Param('id') id: string): Promise<OrderResponse> {
    const order = await this.orderService.findOne(id);
    if (!order) {
      throw new Error('Commande non trouvée');
    }
    
    return this.mapToOrderResponse(order);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  async update(
    @Param('id') id: string, 
    @Body() updateData: Prisma.OrderUpdateInput
  ): Promise<OrderResponse> {
    const updatedOrder = await this.orderService.update(id, updateData);
    
    if (!updatedOrder) {
      throw new Error('Commande non trouvée');
    }
    
    return this.mapToOrderResponse(updatedOrder);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    const deleted = await this.orderService.remove(id);
    
    if (!deleted) {
      throw new Error('Commande non trouvée');
    }
    
    return { success: true };
  }

  private mapToOrderResponse(order: {
    id: string;
    user_id: string | null;
    status: string;
    total_amount: number | string | bigint | Prisma.Decimal;
    coupon_code: string | null;
    discount_amount: number | string | bigint | Prisma.Decimal;
    final_amount: number | string | bigint | Prisma.Decimal;
    created_at: Date;
    updated_at: Date;
  }): OrderResponse {
    return {
      id: order.id,
      user_id: order.user_id,
      status: order.status,
      total_amount: Number(order.total_amount),
      coupon_code: order.coupon_code,
      discount_amount: Number(order.discount_amount),
      final_amount: Number(order.final_amount),
      created_at: order.created_at.toISOString(),
      updated_at: order.updated_at.toISOString(),
    };
  }
}
