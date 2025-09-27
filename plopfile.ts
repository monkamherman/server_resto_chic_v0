/* eslint-disable @typescript-eslint/no-explicit-any */
import { NodePlopAPI } from "plop";
import * as fs from "fs";
import * as path from "path";

// Type simplifié pour les actions Plop
type PlopAction = any; // On utilise 'any' pour simplifier et éviter les problèmes de typage

export default function (plop: NodePlopAPI) {
  // === CONFIGURATION ===
  plop.setWelcomeMessage("Bienvenue dans le générateur de code !");
  plop.setGenerator("help", {
    description: "Afficher l'aide",
    prompts: [],
    actions: [],
  });
  // === HELPERS ===
  plop.setHelper("toLowerCase", (text: string) => text.toLowerCase());
  plop.setHelper("toPascalCase", (text: string) =>
    text.replace(
      /(\w)(\w*)/g,
      (_, g1, g2) => g1.toUpperCase() + g2.toLowerCase(),
    ),
  );

  // === GÉNÉRATEUR DE DOMAINE COMPLET ===
  plop.setGenerator("domain", {
    description: "Créer une structure complète pour un domaine",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Nom du domaine (ex: User, Product):",
        validate: (value: string) => {
          if (!value) return "Le nom est requis";
          return true;
        },
      },
      {
        type: "confirm",
        name: "withCrud",
        message: "Avec opérations CRUD complètes?",
        default: true,
      },
    ],
    actions: function (data: any): any[] {
      const basePath = "src/domains/{{toLowerCase name}}";
      const actions: PlopAction[] = [
        // Interface du repository
        {
          type: "add",
          path: `${basePath}/repositories/I{{toPascalCase name}}Repository.ts`,
          templateFile: ".plop-templates/domain/irepository.ts.hbs",
        },
        // Implémentation du repository
        {
          type: "add",
          path: `${basePath}/repositories/{{toPascalCase name}}Repository.ts`,
          templateFile: ".plop-templates/domain/repository.ts.hbs",
        },
        // DTOs
        {
          type: "add",
          path: `${basePath}/dtos/Create{{toPascalCase name}}Dto.ts`,
          templateFile: ".plop-templates/domain/dtos/create-dto.ts.hbs",
        },
        {
          type: "add",
          path: `${basePath}/dtos/Update{{toPascalCase name}}Dto.ts`,
          templateFile: ".plop-templates/domain/dtos/update-dto.ts.hbs",
          skip: !data.withCrud,
        },
      ];

      // Ajouter les contrôleurs et tests
      const controllerActions = [
        {
          type: "add",
          path: `src/interfaces/controllers/{{toLowerCase name}}/create{{toPascalCase name}}.controller.ts`,
          templateFile: ".plop-templates/controller/create-controller.ts.hbs",
        },
        {
          type: "add",
          path: `src/interfaces/controllers/{{toLowerCase name}}/{{toLowerCase name}}.controller.ts`,
          templateFile: ".plop-templates/controller/base-controller.ts.hbs",
        },
        {
          type: "add",
          path: `test/unit/controllers/{{toLowerCase name}}.controller.test.ts`,
          templateFile: ".plop-templates/test/controller.test.ts.hbs",
        },
      ];

      // Ajouter les routes
      const routeAction = {
        type: "add",
        path: `src/interfaces/routes/{{toLowerCase name}}.routes.ts`,
        templateFile: ".plop-templates/domain/routes.ts.hbs",
      };

      // Ajouter les actions CRUD si nécessaire
      if (data.withCrud) {
        const crudActions = ["get", "update", "delete"].map((action) => ({
          type: "add",
          path: `src/interfaces/controllers/{{toLowerCase name}}/${action}{{toPascalCase name}}.controller.ts`,
          templateFile: `.plop-templates/controller/${action}-controller.ts.hbs`,
        }));

        return [...actions, ...controllerActions, ...crudActions, routeAction];
      }

      return [...actions, ...controllerActions, routeAction];
    },
  });

  // === GÉNÉRATEUR DE CONTROLEUR PAR ACTION ===
  plop.setGenerator("controller", {
    description: "Créer un contrôleur avec documentation Swagger",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Nom de la ressource (ex: User):",
        validate: (value: string) => {
          if (!value) return "Le nom est requis";
          return true;
        },
      },
      {
        type: "list",
        name: "action",
        message: "Action du contrôleur:",
        choices: [
          { name: "Créer (Create)", value: "create" },
          { name: "Lire (Read/Get)", value: "get" },
          { name: "Mettre à jour (Update)", value: "update" },
          { name: "Supprimer (Delete)", value: "delete" },
          { name: "Toutes les actions CRUD", value: "crud" },
        ],
      },
    ],
    actions: function (data: any): any[] {
      const actions: PlopAction[] = [];
      const controllerActions: string[] =
        data.action === "crud"
          ? ["create", "get", "update", "delete"]
          : [data.action];

      // Créer la structure de dossiers pour le contrôleur
      actions.push({
        type: "add",
        path: `src/interfaces/controllers/{{toLowerCase name}}/index.ts`,
        templateFile: ".plop-templates/controller/index.ts.hbs",
        skipIfExists: true,
        force: false,
      });

      // Ajouter chaque action de contrôleur
      controllerActions.forEach((action) => {
        // Fichier du contrôleur
        actions.push({
          type: "add",
          path: `src/interfaces/controllers/{{toLowerCase name}}/${action}/{{toLowerCase name}}.controller.ts`,
          templateFile: `.plop-templates/controller/${action}.controller.ts.hbs`,
        });

        // Fichier de test
        actions.push({
          type: "add",
          path: `src/interfaces/controllers/{{toLowerCase name}}/${action}/__tests__/{{toLowerCase name}}.controller.spec.ts`,
          templateFile: `.plop-templates/controller/__tests__/${action}.controller.spec.ts.hbs`,
        });
      });

      // Mettre à jour le fichier d'index pour chaque action
      if (data.action === "crud") {
        const actions = ["create", "get", "update", "delete"];
        // Ajouter les imports
        const importStatements = actions
          .map(
            (action) =>
              `import { ${action.charAt(0).toUpperCase() + action.slice(1)}${data.name}Controller } from './${action}/${data.name.toLowerCase()}.controller';`,
          )
          .join("\n");

        // Ajouter les exports
        const exportStatements = actions
          .map(
            (action) =>
              `  ${action.charAt(0).toUpperCase() + action.slice(1)}${data.name}Controller,`,
          )
          .join("\n");

        // Mettre à jour le fichier index.ts
        // Mise à jour du fichier index.ts avec les imports et exports
        const indexContent = `/*-- IMPORTS --*/
${importStatements}

/*-- EXPORTS --*/
export {
${exportStatements}
}`;

        // Écriture directe dans le fichier
        const indexPath = path.join(
          process.cwd(),
          "src",
          "interfaces",
          "controllers",
          data.name.toLowerCase(),
          "index.ts",
        );
        fs.writeFileSync(indexPath, indexContent);
      }

      return actions;
    },
  });

  // === GÉNÉRATEUR DE REPOSITORY ===
  plop.setGenerator("repository", {
    description: "Créer un repository avec son interface",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Nom de la ressource (ex: User):",
        validate: (value: string) => {
          if (!value) return "Le nom est requis";
          return true;
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/domains/{{toLowerCase name}}/repositories/I{{toPascalCase name}}Repository.ts",
        templateFile: ".plop-templates/domain/irepository.ts.hbs",
      },
      {
        type: "add",
        path: "src/domains/{{toLowerCase name}}/repositories/{{toPascalCase name}}Repository.ts",
        templateFile: ".plop-templates/domain/repository.ts.hbs",
      },
      {
        type: "add",
        path: "test/unit/repositories/{{toLowerCase name}}.repository.test.ts",
        templateFile: ".plop-templates/test/controller.test.hbs",
      },
    ],
  });

  // === GÉNÉRATEUR DE TESTS AVEC SWAGGER ===
  plop.setGenerator("swagger-test", {
    description: "Créer des tests avec vérification Swagger intégrée",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Nom du contrôleur à tester (ex: User, Auth) :",
        validate: (value: string) => {
          if (!value) return "Le nom est requis";
          return true;
        },
      },
      {
        type: "input",
        name: "path",
        message: "Chemin relatif depuis le dossier src (ex: users, auth) :",
        default: (answers: { name: string }) =>
          answers.name.toLowerCase() + "s",
      },
      {
        type: "confirm",
        name: "withAuth",
        message: "Le contrôleur nécessite-t-il une authentification ?",
        default: true,
      },
    ],
    actions: (data: any) => {
      const { name, path, withAuth } = data;

      return [
        {
          type: "add",
          path: `test/${path}/${name.toLowerCase()}.controller.swagger.spec.ts`,
          templateFile: "plop-templates/test/controller.swagger.test.hbs",
          data: { name, path, withAuth },
        },
        {
          type: "add",
          path: "test/README-SWAGGER-TESTS.md",
          template:
            "# Tests avec vérification Swagger\n\nCes tests vérifient automatiquement que la documentation Swagger est synchronisée avec l'implémentation.\n\n## Comment utiliser\n\n1. Exécutez les tests :\n   ```bash\n   bun test\n   ```\n\n2. Vérifiez la documentation Swagger :\n   - Démarrez le serveur\n   - Allez sur `/api` pour voir la documentation\n\n## Bonnes pratiques\n\n- Mettez à jour les décorateurs Swagger dans vos contrôleurs\n- Exécutez les tests après chaque modification\n- Vérifiez que la documentation générée est correcte\n",
          skipIfExists: true,
        },
      ];
    },
  });
}
