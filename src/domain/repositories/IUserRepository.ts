import { User, UserInput, UserUpdateInput } from "../entities/User";

export interface IUserRepository {
  // CRUD Operations
  create(user: UserInput): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByPhone(phoneNumber: string): Promise<User | null>;
  update(id: string, userData: UserUpdateInput): Promise<User>;
  delete(id: string): Promise<boolean>;

  // Specific methods
  createUserWithOtp(userData: {
    fullName: string;
    phoneNumber: string;
    otpCode: string;
    otpExpiresAt: Date;
    email?: string;
    nom?: string;
    prenom?: string;
    sexe?: string;
  }): Promise<User>;

  updateOtp(updateData: {
    phoneNumber: string;
    otpCode?: string;
    otpExpiresAt?: Date | null;
    otpVerified?: boolean;
    otpSentAt?: Date | null;
  }): Promise<User>;

  /**
   * Vérifie si le mot de passe fourni correspond à celui de l'utilisateur
   * @param userId Identifiant de l'utilisateur
   * @param password Mot de passe à vérifier
   * @returns true si le mot de passe est valide, false sinon
   */
  verifyPassword(userId: string, password: string): Promise<boolean>;

  /**
   * Met à jour le mot de passe d'un utilisateur
   * @param userId Identifiant de l'utilisateur
   * @param newPassword Nouveau mot de passe (déjà haché)
   */
  updatePassword(userId: string, newPassword: string): Promise<void>;

  completeRegistration(data: {
    userId: string;
    email: string;
    password: string;
    phoneNumber: string;
  }): Promise<User>;

  findUserWithRole(userId: string): Promise<(User & { role: string }) | null>;
}
