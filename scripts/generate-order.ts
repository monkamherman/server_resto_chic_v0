import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Configuration
const DOMAIN = 'Order';
const DOMAIN_LOWER = DOMAIN.toLowerCase();
const DOMAIN_KEBAB = DOMAIN.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

// Chemins des dossiers
const paths = {
  domain: path.join(process.cwd(), 'src/domain', DOMAIN_LOWER),
  controllers: path.join(process.cwd(), 'src/interfaces/controllers', DOMAIN_LOWER),
  routes: path.join(process.cwd(), 'src/interfaces/routes'),
};

// Créer les dossiers nécessaires
Object.values(paths).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Créé le dossier: ${dir}`);
  }
});

// Créer le fichier du repository
const repositoryContent = `import { PrismaClient, ${DOMAIN} as Prisma${DOMAIN} } from '@prisma/client';
import { I${DOMAIN}Repository } from './repositories/I${DOMAIN}Repository';

export class ${DOMAIN}Repository implements I${DOMAIN}Repository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: Create${DOMAIN}Dto): Promise<${DOMAIN}> {
    return this.prisma.${DOMAIN_LOWER}.create({ data });
  }

  async findById(id: string): Promise<${DOMAIN} | null> {
    return this.prisma.${DOMAIN_LOWER}.findUnique({ where: { id } });
  }

  async update(id: string, data: Update${DOMAIN}Dto): Promise<${DOMAIN} | null> {
    return this.prisma.${DOMAIN_LOWER}.update({ where: { id }, data });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.prisma.${DOMAIN_LOWER}.delete({ where: { id } });
    return !!result;
  }

  async findAll(): Promise<${DOMAIN}[]> {
    return this.prisma.${DOMAIN_LOWER}.findMany();
  }
}
`;

// Créer le fichier de l'interface du repository
const irepositoryContent = `import { ${DOMAIN} } from '@prisma/client';

export interface I${DOMAIN}Repository {
  create(data: Create${DOMAIN}Dto): Promise<${DOMAIN}>;
  findById(id: string): Promise<${DOMAIN} | null>;
  update(id: string, data: Update${DOMAIN}Dto): Promise<${DOMAIN} | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<${DOMAIN}[]>;
}
`;

// Créer les DTOs
const createDtoContent = `import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class Create${DOMAIN}Dto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNumber()
  @IsNotEmpty()
  total_amount: number;

  @IsString()
  @IsOptional()
  coupon_code?: string;

  @IsNumber()
  @IsOptional()
  discount_amount?: number;

  @IsNumber()
  @IsNotEmpty()
  final_amount: number;
}
`;

const updateDtoContent = `import { PartialType } from '@nestjs/mapped-types';
import { Create${DOMAIN}Dto } from './create-${DOMAIN_KEBAB}.dto';

export class Update${DOMAIN}Dto extends PartialType(Create${DOMAIN}Dto) {}
`;

// Créer le service
const serviceContent = `import { Injectable } from '@nestjs/common';
import { I${DOMAIN}Repository } from '../repositories/I${DOMAIN}Repository';
import { Create${DOMAIN}Dto } from '../dtos/create-${DOMAIN_KEBAB}.dto';
import { Update${DOMAIN}Dto } from '../dtos/update-${DOMAIN_KEBAB}.dto';

export class ${DOMAIN}Service {
  constructor(private readonly ${DOMAIN_LOWER}Repository: I${DOMAIN}Repository) {}

  async create(create${DOMAIN}Dto: Create${DOMAIN}Dto) {
    return this.${DOMAIN_LOWER}Repository.create(create${DOMAIN}Dto);
  }

  async findAll() {
    return this.${DOMAIN_LOWER}Repository.findAll();
  }

  async findOne(id: string) {
    return this.${DOMAIN_LOWER}Repository.findById(id);
  }

  async update(id: string, update${DOMAIN}Dto: Update${DOMAIN}Dto) {
    return this.${DOMAIN_LOWER}Repository.update(id, update${DOMAIN}Dto);
  }

  async remove(id: string) {
    return this.${DOMAIN_LOWER}Repository.delete(id);
  }
}
`;

// Créer les fichiers
const files = [
  { path: path.join(paths.domain, `repositories/${DOMAIN}Repository.ts`), content: repositoryContent },
  { path: path.join(paths.domain, `repositories/I${DOMAIN}Repository.ts`), content: irepositoryContent },
  { path: path.join(paths.domain, `dtos/create-${DOMAIN_KEBAB}.dto.ts`), content: createDtoContent },
  { path: path.join(paths.domain, `dtos/update-${DOMAIN_KEBAB}.dto.ts`), content: updateDtoContent },
  { path: path.join(paths.domain, `services/${DOMAIN_LOWER}.service.ts`), content: serviceContent },
];

// Écrire les fichiers
files.forEach(({ path: filePath, content }) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`Créé le fichier: ${filePath}`);
  } else {
    console.log(`Le fichier existe déjà: ${filePath}`);
  }
});

console.log('\n✅ Structure du domaine Order créée avec succès !');
console.log('\nProchaines étapes :');
console.log('1. Implémentez la logique métier dans le service');
console.log('2. Créez les contrôleurs et les routes');
console.log('3. Ajoutez la validation des données');
console.log('4. Implémentez la gestion des erreurs');
