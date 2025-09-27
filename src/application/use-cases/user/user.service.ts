import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import {
  IUserRepository,
  USER_REPOSITORY,
} from "../../domain/repositories/user-repository.interface";
import { User } from "../../domain/entities/user.entity";
import { CreateUserDto } from "../../../interfaces/controllers/dto/create-user.dto";
import { UpdateUserDto } from "../../../interfaces/controllers/dto/update-user.dto";
import { UserRole } from "../../domain/users/enums/user-role.enum";

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async findAll(filters?: {
    isActive?: boolean;
    role?: UserRole;
  }): Promise<User[]> {
    return this.userRepository.findAll(filters);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException("Utilisateur non trouvé");
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.userRepository.findByPhoneNumber(phoneNumber);
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.userRepository.findByResetToken(token);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Vérifier si l'utilisateur existe déjà avec cet email
    if (createUserDto.email) {
      const existingUser = await this.userRepository.findByEmail(
        createUserDto.email,
      );
      if (existingUser) {
        throw new ConflictException(
          "Un utilisateur avec cet email existe déjà",
        );
      }
    }

    // Vérifier si l'utilisateur existe déjà avec ce numéro de téléphone
    const existingUserByPhone = await this.userRepository.findByPhoneNumber(
      createUserDto.phoneNumber,
    );
    if (existingUserByPhone) {
      throw new ConflictException(
        "Un utilisateur avec ce numéro de téléphone existe déjà",
      );
    }

    return this.userRepository.create(createUserDto);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Vérifier si l'utilisateur existe
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException("Utilisateur non trouvé");
    }

    // Vérifier si le nouvel email est déjà utilisé
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const userWithSameEmail = await this.userRepository.findByEmail(
        updateUserDto.email,
      );
      if (userWithSameEmail && userWithSameEmail.id !== id) {
        throw new ConflictException(
          "Un utilisateur avec cet email existe déjà",
        );
      }
    }

    // Vérifier si le nouveau numéro de téléphone est déjà utilisé
    if (
      updateUserDto.phoneNumber &&
      updateUserDto.phoneNumber !== existingUser.phoneNumber
    ) {
      const userWithSamePhone = await this.userRepository.findByPhoneNumber(
        updateUserDto.phoneNumber,
      );
      if (userWithSamePhone && userWithSamePhone.id !== id) {
        throw new ConflictException(
          "Un utilisateur avec ce numéro de téléphone existe déjà",
        );
      }
    }

    return this.userRepository.update(id, updateUserDto);
  }

  async delete(id: string): Promise<void> {
    // Vérifier si l'utilisateur existe
    await this.findById(id);
    return this.userRepository.delete(id);
  }

  async setUserActiveStatus(id: string, isActive: boolean): Promise<User> {
    return this.userRepository.update(id, { isActive });
  }

  async updateUserRole(id: string, role: UserRole): Promise<User> {
    return this.userRepository.update(id, { role });
  }
}
