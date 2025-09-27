export const ERROR_MESSAGES = {
  // Messages d'erreur génériques
  INTERNAL_SERVER_ERROR: "Une erreur interne est survenue",
  INVALID_INPUT: "Données d'entrée invalides",
  NOT_FOUND: "Ressource non trouvée",
  UNAUTHORIZED: "Non autorisé",
  FORBIDDEN: "Accès refusé",

  // Messages d'erreur utilisateur
  USER_NOT_FOUND: "Utilisateur non trouvé",
  USER_ALREADY_EXISTS: "Un utilisateur avec cet email existe déjà",
  USER_UPDATE_ERROR: "Erreur lors de la mise à jour de l'utilisateur",
  USER_DELETE_ERROR: "Erreur lors de la suppression de l'utilisateur",
  USER_FETCH_ERROR: "Erreur lors de la récupération de l'utilisateur",
  USERS_FETCH_ERROR: "Erreur lors de la récupération des utilisateurs",

  // Messages d'erreur d'authentification
  INVALID_CREDENTIALS: "Identifiants invalides",
  INVALID_TOKEN: "Jeton d'authentification invalide",
  TOKEN_EXPIRED: "Jeton d'authentification expiré",

  // Messages d'erreur de validation
  VALIDATION_ERROR: "Erreur de validation",
  MISSING_FIELDS: "Tous les champs sont obligatoires",
  INVALID_EMAIL: "Adresse email invalide",
  INVALID_PHONE: "Numéro de téléphone invalide",
  PASSWORD_TOO_WEAK: "Le mot de passe est trop faible",

  // Messages d'erreur OTP
  INVALID_OTP: "Code OTP invalide",
  OTP_EXPIRED: "Le code OTP a expiré",
  OTP_SEND_ERROR: "Erreur lors de l'envoi du code OTP",

  // Messages d'erreur spécifiques
  EMAIL_ALREADY_EXISTS: "Un utilisateur avec cet email existe déjà",
  PHONE_ALREADY_EXISTS:
    "Un utilisateur avec ce numéro de téléphone existe déjà",
  MISSING_REQUIRED_FIELDS: "Tous les champs obligatoires doivent être remplis",
  MISSING_OTP_OR_PHONE:
    "Le numéro de téléphone et le code OTP sont obligatoires",
  PHONE_REQUIRED: "Le numéro de téléphone est obligatoire",
  INVALID_REGISTRATION_STEP: "Étape d'inscription non valide",
} as const;

export const SUCCESS_MESSAGES = {
  // Messages de succès génériques
  OPERATION_SUCCESSFUL: "Opération effectuée avec succès",

  // Messages de succès utilisateur
  USER_CREATED: "Utilisateur créé avec succès",
  USER_UPDATED: "Utilisateur mis à jour avec succès",
  USER_DELETED: "Utilisateur supprimé avec succès",

  // Messages de succès OTP
  OTP_SENT: "Code OTP envoyé avec succès",
  OTP_VERIFIED: "Code OTP vérifié avec succès",
  OTP_RESENT: "Nouveau code OTP envoyé avec succès",

  // Messages de succès d'inscription
  REGISTRATION_STARTED: "Inscription démarrée avec succès",
  REGISTRATION_COMPLETE: "Inscription terminée avec succès",
} as const;
