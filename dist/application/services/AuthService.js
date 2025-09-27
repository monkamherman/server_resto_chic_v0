"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const inversify_1 = require("inversify");
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcrypt"));
const injection_types_1 = require("@shared/constants/injection.types");
let AuthService = class AuthService {
    userRepository;
    JWT_SECRET;
    JWT_EXPIRES_IN;
    REFRESH_TOKEN_SECRET;
    REFRESH_TOKEN_EXPIRES_IN;
    constructor(userRepository) {
        this.userRepository = userRepository;
        // TODO: Déplacer ces valeurs dans un fichier de configuration
        this.JWT_SECRET = process.env.JWT_SECRET || "votre_secret_jwt";
        this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
        this.REFRESH_TOKEN_SECRET =
            process.env.REFRESH_TOKEN_SECRET || "votre_refresh_token_secret";
        this.REFRESH_TOKEN_EXPIRES_IN =
            process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
    }
    async login(email, password) {
        // Vérifier si l'utilisateur existe
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("Identifiants invalides");
        }
        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password || "");
        if (!isPasswordValid) {
            throw new Error("Identifiants invalides");
        }
        // Générer les tokens
        const token = this.generateToken(user);
        const refreshToken = this.generateRefreshToken(user);
        // Retourner les informations de l'utilisateur et les tokens
        return {
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                // Ajouter d'autres champs nécessaires
            },
            token,
            refreshToken,
        };
    }
    async refreshToken(refreshToken) {
        try {
            // Vérifier le refresh token
            const payload = jwt.verify(refreshToken, this.REFRESH_TOKEN_SECRET);
            // Récupérer l'utilisateur
            const user = await this.userRepository.findById(payload.userId);
            if (!user) {
                throw new Error("Utilisateur non trouvé");
            }
            // Générer de nouveaux tokens
            const newToken = this.generateToken(user);
            const newRefreshToken = this.generateRefreshToken(user);
            return {
                token: newToken,
                refreshToken: newRefreshToken,
            };
        }
        catch (error) {
            throw new Error("Refresh token invalide");
        }
    }
    async logout(token) {
        // Implémentez ici la logique pour invalider le token
        // Par exemple, stocker le token dans une liste noire
        // Cette implémentation dépend de votre stratégie de gestion des tokens
        console.log(`Déconnexion de l'utilisateur avec le token: ${token}`);
    }
    generateToken(user) {
        const payload = {
            userId: user.id,
            email: user.email || undefined,
            role: user.role,
        };
        return jwt.sign(payload, this.JWT_SECRET, {
            expiresIn: parseInt(this.JWT_EXPIRES_IN, 10),
        });
    }
    generateRefreshToken(user) {
        const payload = { userId: user.id };
        return jwt.sign(payload, this.REFRESH_TOKEN_SECRET, {
            expiresIn: parseInt(this.REFRESH_TOKEN_EXPIRES_IN, 10),
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(injection_types_1.TYPES.UserRepository)),
    __metadata("design:paramtypes", [Object])
], AuthService);
//# sourceMappingURL=AuthService.js.map