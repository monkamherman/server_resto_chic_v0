"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("@application/use-cases/user/user.service");
const auth_service_1 = require("@application/use-cases/auth/auth.service");
const user_role_enum_1 = require("@domain/users/enums/user-role.enum");
function isErrorWithMessage(error) {
    return (typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string');
}
// Créer une instance des services nécessaires
const configService = new config_1.ConfigService();
const jwtService = new jwt_1.JwtService({
    secret: configService.get('JWT_SECRET') || 'secretKey',
    signOptions: { expiresIn: '1h' },
});
// Créer une instance factice de UserRepository pour UserService
const mockUserRepository = {
    // Implémentez les méthodes nécessaires ici
    findByEmail: () => Promise.resolve(null),
    findByPhoneNumber: () => Promise.resolve(null),
    findById: () => Promise.resolve(null),
    create: () => Promise.resolve({
        id: 'mock-user-id',
        email: 'mock@example.com',
        password: 'hashedpassword',
        role: user_role_enum_1.UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
    }),
    update: () => Promise.resolve({
        id: 'mock-user-id',
        email: 'mock@example.com',
        role: user_role_enum_1.UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
    }),
    delete: () => Promise.resolve(true),
    findAll: () => Promise.resolve([]),
    exists: () => Promise.resolve(false),
    findByRole: () => Promise.resolve([]),
    updatePassword: () => Promise.resolve(true),
};
const userService = new user_service_1.UserService(mockUserRepository);
const authService = new auth_service_1.AuthService(userService, jwtService, configService);
exports.default = {
    async signup(req, res) {
        try {
            // Extraire les champs du corps de la requête
            const { email, password, fullName, phoneNumber, nom, prenom, sexe } = req.body;
            // Créer un objet RegisterDto avec les champs requis
            const registerDto = {
                email, // email est optionnel dans le DTO
                password,
                fullName,
                phoneNumber,
                role: user_role_enum_1.UserRole.USER,
                nom,
                prenom,
                sexe
            };
            const result = await authService.register(registerDto);
            res.status(201).json(result);
        }
        catch (error) {
            const errorMessage = isErrorWithMessage(error)
                ? error.message
                : 'Une erreur est survenue lors de l\'inscription';
            res.status(400).json({ message: errorMessage });
        }
    },
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await authService.validateUserByEmail(email, password);
            res.json(result);
        }
        catch (error) {
            const errorMessage = isErrorWithMessage(error)
                ? error.message
                : 'Identifiants invalides';
            res.status(401).json({ message: errorMessage });
        }
    },
    async me(req, res) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ message: 'Non authentifié' });
            }
            res.json(user);
        }
        catch (error) {
            const errorMessage = isErrorWithMessage(error)
                ? error.message
                : 'Erreur serveur';
            res.status(500).json({ message: errorMessage });
        }
    },
    async logout(req, res) {
        try {
            const userId = req.user?.id;
            if (userId) {
                // Implémentez la logique de déconnexion si nécessaire
                // Par exemple, invalider le token JWT côté serveur
            }
            res.clearCookie('refreshToken');
            res.json({ message: 'Déconnexion réussie' });
        }
        catch (error) {
            const errorMessage = isErrorWithMessage(error)
                ? error.message
                : 'Erreur lors de la déconnexion';
            res.status(500).json({ message: errorMessage });
        }
    }
};
//# sourceMappingURL=auth.controller.js.map