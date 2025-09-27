"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_MESSAGES = exports.APP_MESSAGES = exports.OTP_MESSAGES = void 0;
// Messages liés aux OTP
exports.OTP_MESSAGES = {
    WELCOME_OTP: (otp) => `Votre code de vérification KDM est : *${otp}*. Ce code expirera dans 30 minutes.`,
    OTP_SENT: "Un code de vérification a été envoyé avec succès.",
    OTP_VERIFIED: "Code de vérification validé avec succès.",
    OTP_EXPIRED: "Le code de vérification a expiré. Veuillez en demander un nouveau.",
    OTP_INVALID: "Le code de vérification est invalide.",
    OTP_RETRY: (minutes) => `Veuillez patienter ${minutes} minute(s) avant de demander un nouveau code.`,
    INVALID_PHONE: "Numéro de téléphone invalide ou non enregistré sur WhatsApp.",
    PHONE_ALREADY_EXISTS: "Ce numéro de téléphone est déjà utilisé.",
};
// Messages génériques de l'application
exports.APP_MESSAGES = {
    SUCCESS: "Opération effectuée avec succès.",
    ERROR: "Une erreur est survenue lors du traitement de votre demande.",
    UNAUTHORIZED: "Accès non autorisé.",
    FORBIDDEN: "Accès refusé.",
    NOT_FOUND: "Ressource non trouvée.",
    VALIDATION_ERROR: "Erreur de validation des données.",
    REQUIRED_FIELD: (field) => `Le champ ${field} est obligatoire.`,
    INVALID_CREDENTIALS: "Identifiants invalides.",
    ACCOUNT_LOCKED: "Votre compte a été verrouillé. Veuillez contacter le support.",
    ACCOUNT_DISABLED: "Votre compte a été désactivé. Veuillez contacter le support.",
};
// Messages liés à l'authentification
exports.AUTH_MESSAGES = {
    LOGIN_SUCCESS: "Connexion réussie.",
    LOGOUT_SUCCESS: "Déconnexion réussie.",
    INVALID_TOKEN: "Jeton d'authentification invalide ou expiré.",
    TOKEN_EXPIRED: "Votre session a expiré. Veuillez vous reconnecter.",
    PASSWORD_RESET_SENT: "Un email de réinitialisation de mot de passe a été envoyé.",
    PASSWORD_RESET_SUCCESS: "Votre mot de passe a été réinitialisé avec succès.",
};
//# sourceMappingURL=messages.js.map