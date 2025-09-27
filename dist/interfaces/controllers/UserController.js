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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const injection_types_1 = require("@shared/constants/injection.types");
const UserService_1 = require("@application/services/UserService");
const otp_1 = require("@shared/utils/otp");
const whatsapp_1 = require("@shared/services/whatsapp");
const messages_1 = require("@shared/constants/messages");
const error_messages_1 = require("@shared/constants/error-messages");
/**
 * Contrôleur pour la gestion des utilisateurs
 * Gère les opérations CRUD et l'authentification des utilisateurs
 */
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    /**
     * Enregistre un nouvel utilisateur
     * Gère les différentes étapes : enregistrement, vérification OTP, complétion
     */
    async register(req, res) {
        try {
            const { step, nom, prenom, sexe, email, otp, telephone, password } = req.body;
            switch (step) {
                case "register":
                    await this.handleRegistrationStep({ nom, prenom, sexe, email, telephone }, res);
                    break;
                case "verify-otp":
                    await this.handleOtpVerification(telephone, otp, res);
                    break;
                case "complete-registration":
                    await this.handleRegistrationCompletion({
                        telephone,
                        email,
                        password,
                        res,
                    });
                    break;
                default:
                    this.sendErrorResponse(res, 400, error_messages_1.ERROR_MESSAGES.INVALID_REGISTRATION_STEP);
            }
        }
        catch (error) {
            this.handleError(res, error, "Erreur lors de l'inscription");
        }
    }
    /**
     * Récupère tous les utilisateurs
     */
    async getAllUsers(_req, res) {
        try {
            // Implémentation basique - à adapter selon votre logique métier
            // Note: La méthode getAllUsers n'existe pas encore dans le UserService
            // Vous devrez l'implémenter dans le UserService si nécessaire
            this.sendErrorResponse(res, 501, {
                message: "Non implémenté: cette fonctionnalité nécessite une implémentation dans le UserService",
            });
            // Exemple d'implémentation future:
            // const users = await this.userService.getAllUsers();
            // this.sendSuccessResponse(res, {
            //   data: users.map(user => this.formatUserResponse(user))
            // });
        }
        catch (error) {
            this.handleError(res, error, error_messages_1.ERROR_MESSAGES.USERS_FETCH_ERROR);
        }
    }
    /**
     * Récupère un utilisateur par son ID
     */
    async getUserById(id, res) {
        try {
            const user = await this.userService.getUserById(id);
            if (!user) {
                this.sendErrorResponse(res, 404, error_messages_1.ERROR_MESSAGES.USER_NOT_FOUND);
                return;
            }
            this.sendSuccessResponse(res, {
                data: this.formatUserResponse(user),
            });
        }
        catch (error) {
            this.handleError(res, error, error_messages_1.ERROR_MESSAGES.USER_FETCH_ERROR);
        }
    }
    /**
     * Met à jour un utilisateur existant
     */
    async updateUser(id, updateData, res) {
        try {
            const existingUser = await this.userService.getUserById(id);
            if (!existingUser) {
                this.sendErrorResponse(res, 404, error_messages_1.ERROR_MESSAGES.USER_NOT_FOUND);
                return;
            }
            const updatedUser = await this.userService.updateUser(id, updateData);
            this.sendSuccessResponse(res, {
                message: error_messages_1.SUCCESS_MESSAGES.USER_UPDATED,
                data: this.formatUserResponse(updatedUser),
            });
        }
        catch (error) {
            this.handleError(res, error, error_messages_1.ERROR_MESSAGES.USER_UPDATE_ERROR);
        }
    }
    /**
     * Supprime un utilisateur
     */
    async deleteUser(id, res) {
        try {
            const existingUser = await this.userService.getUserById(id);
            if (!existingUser) {
                this.sendErrorResponse(res, 404, error_messages_1.ERROR_MESSAGES.USER_NOT_FOUND);
                return;
            }
            await this.userService.deleteUser(id);
            this.sendSuccessResponse(res, {
                message: error_messages_1.SUCCESS_MESSAGES.USER_DELETED,
            });
        }
        catch (error) {
            this.handleError(res, error, error_messages_1.ERROR_MESSAGES.USER_DELETE_ERROR);
        }
    }
    //#region Méthodes privées
    /**
     * Gère l'étape d'enregistrement initial
     */
    async handleRegistrationStep(data, res) {
        if (!data.nom || !data.telephone) {
            this.sendErrorResponse(res, 400, error_messages_1.ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
            return;
        }
        // Vérifier si l'email existe déjà
        if (data.email) {
            const existingUser = await this.userService.getUserByEmail(data.email);
            if (existingUser) {
                this.sendErrorResponse(res, 400, error_messages_1.ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
                return;
            }
        }
        // Vérifier si le numéro de téléphone existe déjà
        try {
            const existingPhoneUser = await this.userService.getUserByEmail(data.telephone);
            if (existingPhoneUser) {
                this.sendErrorResponse(res, 400, error_messages_1.ERROR_MESSAGES.PHONE_ALREADY_EXISTS);
                return;
            }
        }
        catch (error) {
            // Gérer le cas où la méthode findByPhone n'est pas disponible
            console.warn("Erreur lors de la vérification du numéro de téléphone:", error);
            // On continue quand même car la vérification n'est pas critique
        }
        const otpCode = (0, otp_1.generateOTP)();
        const otpExpiresAt = new Date();
        otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 30);
        const userData = {
            fullName: `${data.prenom || ""} ${data.nom || ""}`.trim(),
            phoneNumber: data.telephone,
            otpCode,
            otpExpiresAt,
            email: data.email,
            nom: data.nom,
            prenom: data.prenom,
            sexe: data.sexe,
        };
        const user = await this.userService.registerWithOtp(userData);
        const message = messages_1.OTP_MESSAGES.WELCOME_OTP(otpCode);
        try {
            await (0, whatsapp_1.sendWhatsAppMessage)(data.telephone, message);
            this.sendSuccessResponse(res, { message: messages_1.OTP_MESSAGES.OTP_SENT });
        }
        catch (error) {
            await this.userService.deleteUser(user.id);
            this.sendErrorResponse(res, 400, {
                message: messages_1.OTP_MESSAGES.INVALID_PHONE,
                code: "INVALID_WHATSAPP_NUMBER",
                details: "Le numéro fourni n'est pas valide ou n'est pas enregistré sur WhatsApp.",
            });
        }
    }
    /**
     * Gère la vérification du code OTP
     */
    async handleOtpVerification(phoneNumber, otp, res) {
        if (!phoneNumber || !otp) {
            this.sendErrorResponse(res, 400, error_messages_1.ERROR_MESSAGES.MISSING_OTP_OR_PHONE);
            return;
        }
        await this.userService.verifyOtp(phoneNumber, otp);
        this.sendSuccessResponse(res, { message: "OTP validé avec succès" });
    }
    /**
     * Gère la complétion de l'inscription
     */
    async handleRegistrationCompletion({ telephone, email, password, res, }) {
        if (!telephone || !email || !password) {
            this.sendErrorResponse(res, 400, error_messages_1.ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
            return;
        }
        const existingUser = await this.userService.getUserByEmail(email);
        if (!existingUser) {
            this.sendErrorResponse(res, 404, error_messages_1.ERROR_MESSAGES.USER_NOT_FOUND);
            return;
        }
        const completeData = {
            userId: existingUser.id,
            email,
            password,
            phoneNumber: telephone,
            nom: existingUser.nom || "",
            prenom: existingUser.prenom || "",
            sexe: existingUser.sexe || "",
        };
        const updatedUser = await this.userService.completeRegistration(completeData);
        this.sendSuccessResponse(res, {
            message: error_messages_1.SUCCESS_MESSAGES.REGISTRATION_COMPLETE,
            user: this.formatUserResponse(updatedUser),
        });
    }
    /**
     * Formate la réponse utilisateur pour la réponse API
     */
    formatUserResponse(user) {
        if (!user)
            return null;
        // Extraire le nom et prénom du fullName si nécessaire
        let nom = "";
        let prenom = "";
        if ("fullName" in user && user.fullName) {
            const nameParts = user.fullName.split(" ");
            prenom = nameParts[0] || "";
            nom = nameParts.slice(1).join(" ") || "";
        }
        return {
            id: user.id,
            nom: ("nom" in user ? user.nom : "") || nom,
            prenom: ("prenom" in user ? user.prenom : "") || prenom,
            sexe: ("sexe" in user ? user.sexe : "") || "",
            email: user.email || "",
            telephone: (("phoneNumber" in user && user.phoneNumber) ||
                ("telephone" in user && user.telephone) ||
                ""),
            role: user.role || "user",
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    /**
     * Envoie une réponse de succès standardisée
     */
    sendSuccessResponse(res, data) {
        res.status(200).json({
            success: true,
            ...data,
        });
    }
    /**
     * Envoie une réponse d'erreur standardisée
     */
    sendErrorResponse(res, statusCode, error) {
        const response = typeof error === "string" ? { message: error } : error;
        res.status(statusCode).json({
            success: false,
            ...response,
        });
    }
    /**
     * Gère les erreurs et envoie une réponse appropriée
     */
    /**
     * Gère les erreurs de manière centralisée
     * @param res L'objet Response d'Express
     * @param error L'erreur survenue
     * @param defaultMessage Le message d'erreur par défaut
     * @param statusCode Le code de statut HTTP par défaut (400 pour les erreurs client, 500 pour les erreurs serveur)
     */
    handleError(res, error, defaultMessage, statusCode = 400) {
        // Journalisation de l'erreur pour le débogage
        console.error(`[${new Date().toISOString()}] Error:`, error);
        // Extraction du message d'erreur
        let errorMessage = defaultMessage;
        let errorCode;
        let errorDetails;
        if (error instanceof Error) {
            errorMessage = error.message || defaultMessage;
            errorDetails =
                process.env.NODE_ENV === "development" ? error.stack : undefined;
        }
        else if (typeof error === "object" && error !== null) {
            // Gestion des erreurs sous forme d'objet
            const errorObj = error;
            errorMessage = errorObj.message || defaultMessage;
            errorCode = errorObj.code;
            errorDetails = errorObj.details;
        }
        // Construction de l'objet de réponse d'erreur
        const errorResponse = {
            success: false,
            message: errorMessage,
        };
        // Ajout des champs optionnels si présents
        if (errorCode) {
            errorResponse.code = errorCode;
        }
        if (errorDetails) {
            errorResponse.details = errorDetails;
        }
        // Envoi de la réponse d'erreur
        this.sendErrorResponse(res, statusCode, errorResponse);
    }
    //#endregion
    /**
     * Renvoie un nouveau code OTP à l'utilisateur
     */
    async resendOtp(req, res) {
        try {
            const { telephone } = req.body;
            if (!telephone) {
                this.sendErrorResponse(res, 400, error_messages_1.ERROR_MESSAGES.PHONE_REQUIRED);
                return;
            }
            const otpCode = (0, otp_1.generateOTP)();
            await this.userService.resendOtp(telephone, otpCode);
            // Envoyer le code OTP par WhatsApp
            const message = messages_1.OTP_MESSAGES.WELCOME_OTP(otpCode);
            await (0, whatsapp_1.sendWhatsAppMessage)(telephone, message);
            this.sendSuccessResponse(res, {
                message: error_messages_1.SUCCESS_MESSAGES.OTP_RESENT,
                code: "OTP_RESENT_SUCCESSFULLY",
            });
        }
        catch (error) {
            this.handleError(res, error, error_messages_1.ERROR_MESSAGES.OTP_SEND_ERROR);
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, inversify_express_utils_1.httpPost)("/register"),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)("/"),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)("/:id"),
    __param(0, (0, inversify_express_utils_1.requestParam)("id")),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, inversify_express_utils_1.httpPut)("/:id"),
    __param(0, (0, inversify_express_utils_1.requestParam)("id")),
    __param(1, (0, inversify_express_utils_1.requestBody)()),
    __param(2, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, inversify_express_utils_1.httpDelete)("/:id"),
    __param(0, (0, inversify_express_utils_1.requestParam)("id")),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)("/resend-otp"),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resendOtp", null);
exports.UserController = UserController = __decorate([
    (0, inversify_express_utils_1.controller)("/users"),
    __param(0, (0, inversify_1.inject)(injection_types_1.TYPES.UserService)),
    __metadata("design:paramtypes", [UserService_1.UserService])
], UserController);
//# sourceMappingURL=UserController.js.map