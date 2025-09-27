export interface User {
  id: string;
  fullName: string;
  email: string | null;
  phoneNumber: string;
  password: string | null;
  role: string;
  nom?: string | null;
  prenom?: string | null;
  sexe?: string | null;
  otpCode?: string | null;
  otpExpiresAt?: Date | null;
  otpVerified: boolean;
  otpSentAt?: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInput {
  fullName: string;
  email?: string | null;
  phoneNumber: string;
  password?: string | null;
  role?: string;
  nom?: string | null;
  prenom?: string | null;
  sexe?: string | null;
}

export interface UserUpdateInput {
  fullName?: string;
  email?: string | null;
  phoneNumber?: string;
  password?: string | null;
  role?: string;
  nom?: string | null;
  prenom?: string | null;
  sexe?: string | null;
  otpCode?: string | null;
  otpExpiresAt?: Date | null;
  otpVerified?: boolean;
  otpSentAt?: Date | null;
  isActive?: boolean;
}
