import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/infrastructure/persistence/prisma/prisma.service';

declare global {
  // eslint-disable-next-line no-var
  var app: INestApplication;
  // eslint-disable-next-line no-var
  var prisma: PrismaService;
}

export const setupTestApp = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  const prisma = app.get(PrismaService);
  await prisma.$connect();

  // Nettoyer la base de données avant les tests
  await prisma.formateur.deleteMany({});

  global.app = app;
  global.prisma = prisma;

  return { app, prisma };
};

export const teardownTestApp = async () => {
  if (global.prisma) {
    await global.prisma.$disconnect();
  }
  if (global.app) {
    await global.app.close();
  }
};
