import { getDMMF } from '@prisma/sdk';
import * as path from 'path';
import * as fs from 'fs';

// Chemin du schéma Prisma
const prismaSchemaPath = path.join(process.cwd(), 'prisma/schema.prisma');

type FieldKind = 'scalar' | 'object' | 'enum';

export interface PrismaField {
  name: string;
  type: string;
  isId?: boolean;
  isRequired: boolean;
  isList: boolean;
  hasDefaultValue: boolean;
  isUnique?: boolean;
  isUpdatedAt?: boolean;
  kind: FieldKind;
  isForeignKey?: boolean;
  relationName?: string;
  relationFromFields?: string[];
  relationToFields?: string[];
  documentation?: string;
}

export interface PrismaModel {
  name: string;
  fields: PrismaField[];
}

export async function getPrismaModels(): Promise<PrismaModel[]> {
  try {
    // Charger le schéma Prisma
    const dmmf = await getDMMF({
      datamodelPath: prismaSchemaPath,
    });

    // Extraire les modèles
    return dmmf.datamodel.models.map((model) => ({
      name: model.name,
      fields: model.fields.map((field) => ({
        name: field.name,
        type: field.type,
        isId: field.isId,
        isRequired: field.isRequired,
        isList: field.isList,
        hasDefaultValue: !!field.default,
        isUnique: field.isUnique,
        isUpdatedAt: field.isUpdatedAt,
        kind: field.kind === 'scalar' || field.kind === 'object' || field.kind === 'enum' 
          ? field.kind 
          : 'scalar', // Fallback to scalar for any other kind
        isForeignKey: field.relationFromFields && field.relationFromFields.length > 0,
        relationName: field.relationName,
        relationFromFields: field.relationFromFields,
        relationToFields: field.relationToFields,
        documentation: field.documentation,
      })),
    }));
  } catch (error) {
    console.error('Erreur lors de la lecture du schéma Prisma:', error);
    throw error;
  }
}

// Fonction utilitaire pour sauvegarder les modèles dans un fichier
export async function savePrismaModelsToFile() {
  try {
    const models = await getPrismaModels();
    const outputPath = path.join(process.cwd(), 'src/generated/prisma-models.json');
    
    // Créer le répertoire s'il n'existe pas
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Écrire les modèles dans un fichier JSON
    fs.writeFileSync(outputPath, JSON.stringify(models, null, 2));
    console.log(`Modèles Prisma enregistrés dans ${outputPath}`);
    return models;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des modèles Prisma:', error);
    throw error;
  }
}

// Exécuter le script
savePrismaModelsToFile().catch(console.error);
