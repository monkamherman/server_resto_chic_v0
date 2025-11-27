import { User } from "@domain/users/entities/user.entity";
import { Dish } from "@domain/dish/entities/dish.entity";

export enum OrderStatus {
  // Nouvelle commande, non traitée
  DRAFT = 'DRAFT',
  // En attente de paiement
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  // Paiement confirmé, en attente de préparation
  CONFIRMED = 'CONFIRMED',
  // En cours de préparation
  IN_PREPARATION = 'IN_PREPARATION',
  // Prête à être servie
  READY_TO_SERVE = 'READY_TO_SERVE',
  // En cours de livraison (si livraison)
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  // Prête à être récupérée (si à emporter)
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  // Servie au client
  SERVED = 'SERVED',
  // Commande terminée
  COMPLETED = 'COMPLETED',
  // Commande annulée
  CANCELLED = 'CANCELLED',
  // Commande remboursée
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  MOBILE_PAYMENT = 'MOBILE_PAYMENT',
  MEAL_VOUCHER = 'MEAL_VOUCHER',
  ONLINE_PAYMENT = 'ONLINE_PAYMENT',
  OTHER = 'OTHER'
}

export enum OrderType {
  DINE_IN = 'DINE_IN',    // Sur place
  TAKEAWAY = 'TAKEAWAY',  // À emporter
  DELIVERY = 'DELIVERY',  // Livraison
  PICK_UP = 'PICK_UP'     // Click & Collect
}

export interface OrderItem {
  id?: string;
  dish: Dish | string;  // Peut être un objet Dish complet ou juste l'ID
  name: string;         // Nom du plat au moment de la commande
  quantity: number;
  unitPrice: number;    // Prix unitaire au moment de la commande
  totalPrice: number;   // unitPrice * quantity
  specialInstructions?: string;
  isPrepared: boolean;
  preparedAt?: Date;
  preparedBy?: string;  // ID du membre du staff qui a préparé le plat
  
  // Pour les modifications de prix ou les offres spéciales
  originalPrice?: number;
  discountApplied?: number;
  discountReason?: string;
}

export interface OrderTimestamps {
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  preparationStartedAt?: Date;
  readyAt?: Date;
  servedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
}

export interface OrderPaymentInfo {
  method: PaymentMethod;
  transactionId?: string;
  amountPaid: number;
  tipAmount?: number;
  changeDue?: number;
  isPaid: boolean;
  paidAt?: Date;
  paymentDetails?: Record<string, unknown>;
}

export class Order {
  id?: string;
  // Numéro de commande unique (ex: ORD-2023-00123)
  orderNumber: string = '';
  
  // Référence utilisateur
  user: User | string = '';  // Peut être un objet User complet ou juste l'ID
  tableNumber?: string;  // Pour les commandes sur place
  customerName?: string; // Pour les commandes sans compte utilisateur
  
  // Détails de la commande
  items: OrderItem[] = [];
  status: OrderStatus = OrderStatus.DRAFT;
  orderType: OrderType = OrderType.DINE_IN;
  
  // Informations de paiement
  payment: OrderPaymentInfo = {
    method: PaymentMethod.CASH,
    amountPaid: 0,
    isPaid: false,
    tipAmount: 0,
    changeDue: 0
  };
  
  // Adresse de livraison (si applicable)
  deliveryAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    instructions?: string;
  };
  
  // Informations complémentaires
  specialInstructions?: string;
  source?: string;  // Ex: 'web', 'mobile_app', 'in_restaurant', 'phone'
  
  // Suivi de la commande
  estimatedReadyTime?: Date;
  actualReadyTime?: Date;
  deliveryTime?: Date;
  
  // Gestion des annulations
  cancelledBy?: string;  // ID de l'utilisateur qui a annulé
  cancellationReason?: string;
  
  // Métadonnées
  timestamps: OrderTimestamps = {
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Référence à la réservation associée (si applicable)
  reservationId?: string;
  
  // Pour les commandes groupées (ex: commande d'entreprise)
  groupId?: string;
  groupName?: string;
  
  // Pour le suivi du personnel
  assignedTo?: string;  // ID du membre du staff assigné
  servedBy?: string;    // ID du serveur qui a servi la commande
  
  constructor(partial: Partial<Order> = {}) {
    Object.assign(this, {
      status: OrderStatus.DRAFT,
      orderType: OrderType.DINE_IN,
      payment: {
        method: PaymentMethod.CASH,
        amountPaid: 0,
        isPaid: false
      },
      timestamps: {
        createdAt: new Date(),
        updatedAt: new Date()
      },
      items: [],
      ...partial
    });
    
    // S'assurer que le total est calculé
    this.calculateTotals();
  }
  
  /**
   * Calcule le montant total de la commande
   */
  calculateTotals(): void {
    if (!this.items || this.items.length === 0) {
      this.payment.amountPaid = 0;
      return;
    }
    
    // Calculer le total des articles
    const subtotal = this.items.reduce(
      (total, item) => total + (item.unitPrice * item.quantity),
      0
    );
    
    // Mettre à jour le montant total
    this.payment.amountPaid = subtotal;
    
    // Mettre à jour le total de chaque article
    this.items.forEach(item => {
      item.totalPrice = item.unitPrice * item.quantity;
    });
  }
  
  /**
   * Ajoute un article à la commande
   */
  addItem(item: Omit<OrderItem, 'totalPrice' | 'isPrepared'>): void {
    const newItem: OrderItem = {
      ...item,
      totalPrice: item.unitPrice * item.quantity,
      isPrepared: false
    };
    
    this.items = [...(this.items || []), newItem];
    this.calculateTotals();
    this.timestamps.updatedAt = new Date();
  }
  
  /**
   * Met à jour le statut de la commande
   */
  updateStatus(newStatus: OrderStatus, updatedBy?: string): void {
    // Mise à jour du statut
    this.status = newStatus;
    this.timestamps.updatedAt = new Date();
    
    // Mettre à jour les horodatages en fonction du statut
    switch (newStatus) {
      case OrderStatus.CONFIRMED:
        this.timestamps.confirmedAt = new Date();
        break;
      case OrderStatus.IN_PREPARATION:
        this.timestamps.preparationStartedAt = new Date();
        break;
      case OrderStatus.READY_TO_SERVE:
      case OrderStatus.READY_FOR_PICKUP:
        this.actualReadyTime = new Date();
        this.timestamps.readyAt = new Date();
        break;
      case OrderStatus.SERVED:
        this.timestamps.servedAt = new Date();
        this.servedBy = updatedBy;
        break;
      case OrderStatus.COMPLETED:
        this.timestamps.completedAt = new Date();
        break;
      case OrderStatus.CANCELLED:
        this.timestamps.cancelledAt = new Date();
        this.cancelledBy = updatedBy;
        break;
    }
    
    // Si la commande est marquée comme payée
    if (newStatus === OrderStatus.COMPLETED && !this.payment.isPaid) {
      this.payment.isPaid = true;
      this.payment.paidAt = new Date();
    }
  }
  
  /**
   * Marque un article comme préparé
   */
  markItemAsPrepared(itemId: string, preparedBy: string): boolean {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return false;
    
    item.isPrepared = true;
    item.preparedAt = new Date();
    item.preparedBy = preparedBy;
    this.timestamps.updatedAt = new Date();
    
    // Vérifier si tous les articles sont préparés
    const allItemsPrepared = this.items.every(i => i.isPrepared);
    if (allItemsPrepared && this.status === OrderStatus.IN_PREPARATION) {
      this.updateStatus(OrderStatus.READY_TO_SERVE);
    }
    
    return true;
  }
  
  /**
   * Vérifie si la commande peut être annulée
   */
  canBeCancelled(): boolean {
    return [
      OrderStatus.DRAFT,
      OrderStatus.PENDING_PAYMENT,
      OrderStatus.CONFIRMED,
      OrderStatus.IN_PREPARATION
    ].includes(this.status);
  }
  
  /**
   * Annule la commande
   */
  cancel(reason: string, cancelledBy: string): boolean {
    if (!this.canBeCancelled()) {
      return false;
    }
    
    this.cancellationReason = reason;
    this.cancelledBy = cancelledBy;
    this.updateStatus(OrderStatus.CANCELLED, cancelledBy);
    
    return true;
  }
  
  /**
   * Applique une réduction à la commande
   */
  applyDiscount(amount: number, reason: string): void {
    if (amount <= 0) return;
    
    const discountPerItem = amount / this.items.length;
    
    this.items = this.items.map(item => ({
      ...item,
      originalPrice: item.originalPrice || item.unitPrice,
      unitPrice: Math.max(0, item.unitPrice - discountPerItem / item.quantity),
      discountApplied: (item.discountApplied || 0) + (discountPerItem / item.quantity),
      discountReason: reason
    }));
    
    this.calculateTotals();
    this.timestamps.updatedAt = new Date();
  }
  
  /**
   * Calcule le temps écoulé depuis la création de la commande
   */
  getElapsedTime(): number {
    return Date.now() - new Date(this.timestamps.createdAt).getTime();
  }
  
  /**
   * Vérifie si la commande est en retard
   */
  isLate(thresholdMinutes: number = 30): boolean {
    if (!this.estimatedReadyTime) return false;
    
    const now = new Date();
    return now > this.estimatedReadyTime && 
           now.getTime() - this.estimatedReadyTime.getTime() > thresholdMinutes * 60 * 1000;
  }
}
