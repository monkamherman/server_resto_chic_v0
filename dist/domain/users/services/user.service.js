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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_interface_1 = require("../repositories/user-repository.interface");
let UserService = class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(createUserDto) {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await this.userRepository.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        // Créer un nouvel utilisateur avec les valeurs par défaut
        const newUser = {
            ...createUserDto,
            isActive: true,
            role: createUserDto.role || 'user'
        };
        return this.userRepository.create(newUser);
    }
    async findAll() {
        return this.userRepository.findAll();
    }
    async findOne(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID "${id}" not found`);
        }
        return user;
    }
    async update(id, updateUserDto) {
        const user = await this.userRepository.update(id, updateUserDto);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID "${id}" not found`);
        }
        return user;
    }
    async remove(id) {
        const result = await this.userRepository.delete(id);
        if (!result) {
            throw new common_1.NotFoundException(`User with ID "${id}" not found`);
        }
    }
    async findByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
    async setCurrentRefreshToken(refreshToken, userId) {
        return this.userRepository.updateRefreshToken(userId, refreshToken);
    }
    async getUserIfRefreshTokenMatches(refreshToken, userId) {
        const user = await this.userRepository.findById(userId);
        if (!user || !user.refreshToken) {
            throw new Error('User not found or no refresh token');
        }
        if (user.refreshToken === refreshToken) {
            return user;
        }
        throw new Error('Invalid refresh token');
    }
    async removeRefreshToken(userId) {
        await this.userRepository.update(userId, { refreshToken: undefined });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], UserService);
//# sourceMappingURL=user.service.js.map