"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_interface_1 = require("../../domain/repositories/user-repository.interface");
let UserService = class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findAll(filters) {
        return this.userRepository.findAll(filters);
    }
    async findById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new common_1.NotFoundException("Utilisateur non trouvé");
        }
        return user;
    }
    async findByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
    async findByPhoneNumber(phoneNumber) {
        return this.userRepository.findByPhoneNumber(phoneNumber);
    }
    async findByResetToken(token) {
        return this.userRepository.findByResetToken(token);
    }
    async create(createUserDto) {
        // Vérifier si l'utilisateur existe déjà avec cet email
        if (createUserDto.email) {
            const existingUser = await this.userRepository.findByEmail(createUserDto.email);
            if (existingUser) {
                throw new common_1.ConflictException("Un utilisateur avec cet email existe déjà");
            }
        }
        // Vérifier si l'utilisateur existe déjà avec ce numéro de téléphone
        const existingUserByPhone = await this.userRepository.findByPhoneNumber(createUserDto.phoneNumber);
        if (existingUserByPhone) {
            throw new common_1.ConflictException("Un utilisateur avec ce numéro de téléphone existe déjà");
        }
        return this.userRepository.create(createUserDto);
    }
    async update(id, updateUserDto) {
        // Vérifier si l'utilisateur existe
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new common_1.NotFoundException("Utilisateur non trouvé");
        }
        // Vérifier si le nouvel email est déjà utilisé
        if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
            const userWithSameEmail = await this.userRepository.findByEmail(updateUserDto.email);
            if (userWithSameEmail && userWithSameEmail.id !== id) {
                throw new common_1.ConflictException("Un utilisateur avec cet email existe déjà");
            }
        }
        // Vérifier si le nouveau numéro de téléphone est déjà utilisé
        if (updateUserDto.phoneNumber &&
            updateUserDto.phoneNumber !== existingUser.phoneNumber) {
            const userWithSamePhone = await this.userRepository.findByPhoneNumber(updateUserDto.phoneNumber);
            if (userWithSamePhone && userWithSamePhone.id !== id) {
                throw new common_1.ConflictException("Un utilisateur avec ce numéro de téléphone existe déjà");
            }
        }
        return this.userRepository.update(id, updateUserDto);
    }
    async delete(id) {
        // Vérifier si l'utilisateur existe
        await this.findById(id);
        return this.userRepository.delete(id);
    }
    async setUserActiveStatus(id, isActive) {
        return this.userRepository.update(id, { isActive });
    }
    async updateUserRole(id, role) {
        return this.userRepository.update(id, { role });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_interface_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [typeof (_a = typeof user_repository_interface_1.IUserRepository !== "undefined" && user_repository_interface_1.IUserRepository) === "function" ? _a : Object])
], UserService);
//# sourceMappingURL=user.service.js.map