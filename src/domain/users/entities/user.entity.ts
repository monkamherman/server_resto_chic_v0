import { Exclude } from 'class-transformer';
import { Order } from '@domain/order/entities/order.entity';
import { Reservation } from '@domain/reservation/entities/reservation.entity';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
  CHEF = 'CHEF',
  WAITER = 'WAITER'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION'
}

export class User {
  id?: string;
  
  // Informations d'authentification
  email!: string;
  username?: string;
  
  @Exclude()
  password!: string;
  
  @Exclude()
  refreshToken?: string;
  
  // Informations personnelles
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  
  // Adresse
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  
  // Préférences
  preferences?: {
    language: string;
    dietaryRestrictions: string[];
    marketingEmails: boolean;
    notificationPreferences: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  
  // Rôle et statut
  role: UserRole = UserRole.CUSTOMER;
  status: UserStatus = UserStatus.PENDING_VERIFICATION;
  
  // Métadonnées
  lastLogin?: Date;
  emailVerified: boolean = false;
  phoneVerified: boolean = false;
  
  // Relations (à peupler par les services)
  orders?: Order[];
  reservations?: Reservation[];
  
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
  
  constructor(partial: Partial<User> = {}) {
    Object.assign(this, partial);
    
    // Initialiser les préférences par défaut si non fournies
    if (!this.preferences) {
      this.preferences = {
        language: 'fr',
        dietaryRestrictions: [],
        marketingEmails: false,
        notificationPreferences: {
          email: true,
          sms: false,
          push: true
        }
      };
    }
  }
  
  get fullName(): string {
    return [this.firstName, this.lastName].filter(Boolean).join(' ').trim() || this.email;
  }
  
  hasRole(role: UserRole | UserRole[]): boolean {
    if (Array.isArray(role)) {
      return role.includes(this.role);
    }
    return this.role === role;
  }
  
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }
  
  isStaff(): boolean {
    return [UserRole.ADMIN, UserRole.STAFF, UserRole.CHEF, UserRole.WAITER].includes(this.role as UserRole);
  }
  
  isActiveUser(): boolean {
    return this.status === UserStatus.ACTIVE && this.emailVerified === true;
  }
}
