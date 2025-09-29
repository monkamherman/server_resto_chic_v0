// =============================================================================
// TYPES POUR LE GÉNÉRATEUR PLOP
// =============================================================================

import { ActionType, AddActionConfig } from "plop";

// =============================================================================
// TYPES DE BASE
// =============================================================================

/**
 * Données de base partagées entre tous les générateurs
 */
export interface BaseGeneratorData {
  name: string;
}

/**
 * Données pour le générateur de domaine
 */
export interface DomainGeneratorData {
  name: string;
  withCrud: boolean;
  withServices?: boolean;
}

/**
 * Données pour le générateur de contrôleur
 */
export interface ControllerGeneratorData {
  name: string;
  action: "create" | "get" | "update" | "delete" | "crud";
}

/**
 * Données pour le générateur de tests Swagger
 */
export interface SwaggerTestGeneratorData {
  name: string;
  path: string;
  withAuth: boolean;
}

/**
 * Données pour le générateur de repository
 */
export interface RepositoryGeneratorData {
  name: string;
  withTests: boolean;
}

// =============================================================================
// TYPES PLOP SPÉCIFIQUES
// =============================================================================

/**
 * Action Plop typée
 */
export type TypedPlopAction =
  | ActionType
  | (AddActionConfig & {
      description?: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      skip?: boolean | ((data: any) => boolean);
    });

/**
 * Réponse de validation standardisée
 */
export interface ValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Fonction de validation pour les prompts Plop
 */
export type PlopValidator = (value: string) => string | boolean;

// =============================================================================
// TYPES POUR LES RÉPONSES DES PROMPTS
// =============================================================================

/**
 * Réponse type pour un prompt de liste
 */
export interface ListPromptAnswer {
  name: string;
  value: string;
}

/**
 * Données combinées pour les actions
 */
export type GeneratorData =
  | BaseGeneratorData
  | DomainGeneratorData
  | ControllerGeneratorData
  | SwaggerTestGeneratorData
  | RepositoryGeneratorData;

// =============================================================================
// TYPES POUR LES TEMPLATES
// =============================================================================

/**
 * Données disponibles dans les templates Handlebars
 */
export interface TemplateData {
  name: string;
  nameLowerCase: string;
  namePascalCase: string;
  nameCamelCase: string;
  withCrud?: boolean;
  withServices?: boolean;
  withAuth?: boolean;
  withTests?: boolean;
  action?: string;
  path?: string;
}

/**
 * Configuration d'un générateur complet
 */
export interface PlopGeneratorConfig {
  description: string;
  prompts: Array<{
    type: string;
    name: string;
    message: string;
    validate?: PlopValidator;
    choices?: ListPromptAnswer[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default?: any;
  }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions: TypedPlopAction[] | ((data: any) => TypedPlopAction[]);
}

// =============================================================================
// TYPES POUR LA GÉNÉRATION DE FICHIERS
// =============================================================================

/**
 * Configuration pour la génération de routes
 */
export interface RouteConfig {
  path: string;
  method: "get" | "post" | "put" | "patch" | "delete";
  controller: string;
  action: string;
  requiresAuth?: boolean;
}

/**
 * Configuration pour un contrôleur CRUD complet
 */
export interface CrudControllerConfig {
  name: string;
  basePath: string;
  actions: Array<"create" | "read" | "update" | "delete">;
  withSwagger: boolean;
  withTests: boolean;
}

// =============================================================================
// UTILITAIRES
// =============================================================================

/**
 * Helper pour créer un validateur
 */
export const createValidator = (
  validatorFn: (value: string) => ValidationResult
): PlopValidator => {
  return (value: string) => {
    const result = validatorFn(value);
    return result.valid || result.message || false;
  };
};

/**
 * Helper pour normaliser les noms
 */
export const NameUtils = {
  toPascalCase: (text: string): string =>
    text.replace(
      /(\w)(\w*)/g,
      (_, g1, g2) => g1.toUpperCase() + g2.toLowerCase()
    ),

  toCamelCase: (text: string): string =>
    text
      .replace(/(?:\s|_)([a-z])/g, (_, g1) => g1.toUpperCase())
      .replace(/^\w/, (c) => c.toLowerCase()),

  toLowerCase: (text: string): string => text.toLowerCase(),

  toKebabCase: (text: string): string =>
    text.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
};

// =============================================================================
// VALIDATEURS PRÉDÉFINIS
// =============================================================================

/**
 * Validateur pour les noms de domaine/resource
 */
export const validateName = (value: string): ValidationResult => {
  if (!value || value.trim().length === 0) {
    return { valid: false, message: "Le nom est requis" };
  }

  if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(value)) {
    return {
      valid: false,
      message:
        "Le nom doit commencer par une lettre et ne contenir que des caractères alphanumériques",
    };
  }

  if (value.length < 2) {
    return {
      valid: false,
      message: "Le nom doit contenir au moins 2 caractères",
    };
  }

  return { valid: true };
};

/**
 * Validateur pour les chemins de dossier
 */
export const validatePath = (value: string): ValidationResult => {
  if (!value || value.trim().length === 0) {
    return { valid: false, message: "Le chemin est requis" };
  }

  if (!/^[a-z0-9-/]+$/.test(value)) {
    return {
      valid: false,
      message:
        "Le chemin ne doit contenir que des lettres minuscules, chiffres, tirets et slashes",
    };
  }

  if (value.includes("..")) {
    return {
      valid: false,
      message: "Le chemin ne doit pas contenir '..'",
    };
  }

  return { valid: true };
};

/**
 * Validateur pour les emails
 */
export const validateEmail = (value: string): ValidationResult => {
  if (!value) {
    return { valid: false, message: "L'email est requis" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return { valid: false, message: "Format d'email invalide" };
  }

  return { valid: true };
};
