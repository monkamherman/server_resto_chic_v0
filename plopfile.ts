import { NodePlopAPI, ActionType } from "plop";
import type { Answers } from 'inquirer';

// Définition locale de ValidationResult pour éviter les problèmes d'import circulaire
interface ValidationResult {
  valid: boolean;
  message?: string;
}

// =============================================================================
// TYPES LOCAUX SIMPLIFIÉS (pour éviter les problèmes d'import)
// =============================================================================

// L'interface ValidationResult est maintenant importée depuis plop.types.ts

// =============================================================================
// HELPERS DE VALIDATION
// =============================================================================

const validateName = (value: string): ValidationResult => {
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

const validatePath = (value: string): ValidationResult => {
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

// Wrapper pour les validateurs Plop
const plopValidate = (validator: (value: string) => ValidationResult) => {
  return (value: string) => {
    const result = validator(value);
    return result.valid || result.message || false;
  };
};

// =============================================================================
// CONFIGURATION PRINCIPALE
// =============================================================================

export default function (plop: NodePlopAPI) {
  // === CONFIGURATION ===
  plop.setWelcomeMessage("🚀 Bienvenue dans le générateur de code !");
  plop.setGenerator("help", {
    description: "📚 Afficher l'aide",
    prompts: [],
    actions: [],
  });

  // === HELPERS ===
  plop.setHelper("toLowerCase", (text: string) => text.toLowerCase());
  plop.setHelper("toPascalCase", (text: string) =>
    text.replace(
      /(\w)(\w*)/g,
      (_, g1, g2) => g1.toUpperCase() + g2.toLowerCase()
    )
  );
  plop.setHelper("toCamelCase", (text: string) =>
    text
      .replace(/(?:\s|_)([a-z])/g, (_, g1) => g1.toUpperCase())
      .replace(/^\w/, (c) => c.toLowerCase())
  );

  // === GÉNÉRATEUR DE DOMAINE COMPLET ===
  plop.setGenerator("domain", {
    description: "🏗️ Créer une structure complète pour un domaine (DDD)",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Nom du domaine (ex: User, Product, Order):",
        validate: plopValidate(validateName),
      },
      {
        type: "confirm",
        name: "withServices",
        message: "Créer un service métier pour ce domaine?",
        default: true,
      },
    ],
    actions: function () {
      const basePath = "src/domain/{{toLowerCase name}}";
      const actions = [
        // Interface du repository
        {
          type: "add",
          path: `${basePath}/repositories/I{{toPascalCase name}}Repository.ts`,
          templateFile: "templates/domain/irepository.ts.hbs"
        },
        // Implémentation du repository
        {
          type: "add",
          path: `${basePath}/repositories/{{toPascalCase name}}Repository.ts`,
          templateFile: "templates/domain/repository.ts.hbs"
        },
        // DTOs de base
        {
          type: "add",
          path: `${basePath}/dtos/Create{{toPascalCase name}}Dto.ts`,
          templateFile: "templates/domain/dtos/create-dto.ts.hbs"
        },
        {
          type: "add",
          path: `${basePath}/dtos/Update{{toPascalCase name}}Dto.ts`,
          templateFile: "templates/domain/dtos/update-dto.ts.hbs"
        }
      ];

      // Service métier (toujours ajouté car c'est une bonne pratique)
      actions.push({
        type: "add",
        path: `${basePath}/services/{{toPascalCase name}}Service.ts`,
        templateFile: "templates/domain/services/service.ts.hbs"
      });
      

      // Contrôleurs de base
      const controllerActions = [
        {
          type: "add",
          path: `src/interfaces/controllers/{{toLowerCase name}}/create{{toPascalCase name}}.controller.ts`,
          templateFile: "templates/controller/create-controller.ts.hbs"
        },
        {
          type: "add",
          path: `src/interfaces/controllers/{{toLowerCase name}}/{{toLowerCase name}}.controller.ts`,
          templateFile: "templates/controller/base-controller.ts.hbs"
        },
        {
          type: "add",
          path: `test/unit/domain/{{toLowerCase name}}/{{toLowerCase name}}.repository.test.ts`,
          templateFile: "templates/test/repository.test.ts.hbs"
        }
      ];

      // Routes
      const routeAction = {
        type: "add",
        path: `src/interfaces/routes/{{toLowerCase name}}.routes.ts`,
        templateFile: "templates/domain/routes.ts.hbs"
      };

      // Actions CRUD supplémentaires
      const crudActions = ["get", "update", "delete"].map((action) => ({
        type: "add",
        path: `src/interfaces/controllers/{{toLowerCase name}}/${action}{{toPascalCase name}}.controller.ts`,
        templateFile: `templates/controller/${action}-controller.ts.hbs`
      }));

      return [...actions, ...controllerActions, ...crudActions, routeAction];
    },
  });

  // === GÉNÉRATEUR DE CONTROLEUR PAR ACTION ===
  plop.setGenerator("controller", {
    description: "🎮 Créer un contrôleur avec documentation Swagger",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Nom de la ressource (ex: User, Product):",
        validate: plopValidate(validateName),
      },
      {
        type: "list",
        name: "action",
        message: "Action du contrôleur:",
        choices: [
          { name: "📝 Créer (Create)", value: "create" },
          { name: "👁️ Lire (Read/Get)", value: "get" },
          { name: "✏️ Mettre à jour (Update)", value: "update" },
          { name: "🗑️ Supprimer (Delete)", value: "delete" },
          { name: "🔄 Toutes les actions CRUD", value: "crud" },
        ],
      },
    ],
    actions: function (data: Answers = {}) {
      const actions: ActionType[] = [];
      const action = data.action as string || "create";
      const controllerActions: string[] =
        action === "crud"
          ? ["create", "get", "update", "delete"]
          : [action];

      // Créer la structure de dossiers pour le contrôleur
      actions.push({
        type: "add",
        path: `src/interfaces/controllers/{{toLowerCase name}}/index.ts`,
        templateFile: "templates/controller/index.ts.hbs",
        skipIfExists: true,
      });

      // Ajouter chaque action de contrôleur
      controllerActions.forEach((action) => {
        // Fichier du contrôleur
        actions.push({
          type: "add",
          path: `src/interfaces/controllers/{{toLowerCase name}}/${action}/{{toLowerCase name}}.controller.ts`,
          templateFile: `templates/controller/${action}.controller.ts.hbs`,
        });

        // Fichier de test
        actions.push({
          type: "add",
          path: `src/interfaces/controllers/{{toLowerCase name}}/${action}/__tests__/{{toLowerCase name}}.controller.spec.ts`,
          templateFile: `templates/controller/__tests__/${action}.controller.spec.ts.hbs`,
        });
      });

      return actions;
    },
  });

  // === GÉNÉRATEUR DE REPOSITORY ===
  plop.setGenerator("repository", {
    description: "💾 Créer un repository avec son interface",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Nom de la ressource (ex: User, Product):",
        validate: plopValidate(validateName),
      },
    ],
    actions: function () {
      return [
        {
          type: "add",
          path: "src/domain/{{toLowerCase name}}/repositories/I{{toPascalCase name}}Repository.ts",
          templateFile: "templates/domain/irepository.ts.hbs"
        },
        {
          type: "add",
          path: "src/domain/{{toLowerCase name}}/repositories/{{toPascalCase name}}Repository.ts",
          templateFile: "templates/domain/repository.ts.hbs"
        },
        {
          type: "add",
          path: "test/unit/repositories/{{toLowerCase name}}.repository.test.ts",
          templateFile: "templates/test/repository.test.ts.hbs"
        }
      ];
    },
  });

  // === GÉNÉRATEUR DE TESTS AVEC SWAGGER ===
  plop.setGenerator("swagger-test", {
    description: "🧪 Créer des tests avec vérification Swagger intégrée",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Nom du contrôleur à tester (ex: User, Auth):",
        validate: plopValidate(validateName)
      },
      {
        type: "input",
        name: "path",
        message: "Chemin relatif depuis le dossier test (ex: users, auth):",
        default: (answers: { name?: string }) =>
          (answers?.name?.toLowerCase() || '') + "s" || "users",
        validate: plopValidate(validatePath)
      },
      {
        type: "confirm",
        name: "withAuth",
        message: "Le contrôleur nécessite-t-il une authentification?",
        default: true
      }
    ],
    actions: function (data: Answers = {}) {
      const testName = (data.name || 'test').toString().toLowerCase();
      const testPath = (data.path || 'api').toString();
      const withAuth = !!data.withAuth;
      
      return [
        {
          type: "add",
          path: `test/${testPath}/${testName}.controller.swagger.spec.ts`,
          templateFile: "templates/test/controller.swagger.test.ts.hbs",
          data: {
            name: data.name || 'Test',
            path: testPath,
            withAuth: withAuth
          }
        },
        {
          type: "add",
          path: "test/README-SWAGGER-TESTS.md",
          template: "# 🔍 Tests avec vérification Swagger\n\nCes tests vérifient automatiquement que la documentation Swagger est synchronisée avec l'implémentation.\n\n## 🚀 Comment utiliser\n\n1. Exécutez les tests :\n   ```bash\n   npm test\n   ```\n\n2. Vérifiez la documentation Swagger :\n   - Démarrez le serveur\n   - Allez sur `/api` pour voir la documentation\n\n## 📋 Bonnes pratiques\n\n- Mettez à jour les décorateurs Swagger dans vos contrôleurs\n- Exécutez les tests après chaque modification\n- Vérifiez que la documentation générée est correcte\n```",
          skipIfExists: true
        }
      ];
    }
  });
}
