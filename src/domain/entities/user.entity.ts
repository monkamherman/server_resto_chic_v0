import { UserRole } from "../users/enums/user-role.enum";

export class User {
  id!: string;
  fullName!: string;
  nom?: string;
  prenom?: string;
  sexe?: string;
  phoneNumber!: string;
  email?: string;
  password?: string;
  otpCode?: string;
  otpExpiresAt?: Date;
  otpVerified!: boolean;
  otpSentAt?: Date;
  isActive!: boolean;
  role!: UserRole;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  // Méthodes du domaine
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  verifyOtp(code: string): boolean {
    if (!this.otpCode || this.otpCode !== code) {
      return false;
    }
    if (this.otpExpiresAt && this.otpExpiresAt < new Date()) {
      return false;
    }
    this.otpVerified = true;
    this.otpCode = undefined;
    this.otpExpiresAt = undefined;
    return true;
  }
}
