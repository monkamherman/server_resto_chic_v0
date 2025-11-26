import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp, teardownTestApp } from '../test-setup';

describe('FormateursController (e2e)', () => {
  let app: INestApplication;
  let prisma: any;

  beforeAll(async () => {
    const { app: testApp, prisma: testPrisma } = await setupTestApp();
    app = testApp;
    prisma = testPrisma;
  });

  afterAll(async () => {
    await teardownTestApp();
  });

  afterEach(async () => {
    await prisma.formateur.deleteMany({});
  });

  describe('POST /formateurs', () => {
    it('should create a new formateur', async () => {
      const createFormateurDto = {
        prenom: 'Jean',
        nom: 'Dupont',
        email: 'jean.dupont@example.com',
        specialites: ['JavaScript', 'TypeScript'],
        disponibilites: ['LUNDI_MATIN', 'MERCREDI_APRES_MIDI'],
        statut: 'DISPONIBLE',
        telephone: '+33612345678',
      };

      const response = await request(app.getHttpServer())
        .post('/formateurs')
        .send(createFormateurDto)
        .expect(201);

      expect(response.body).toMatchObject({
        prenom: 'Jean',
        nom: 'Dupont',
        email: 'jean.dupont@example.com',
        specialites: expect.arrayContaining(['JavaScript', 'TypeScript']),
        disponibilites: expect.arrayContaining(['LUNDI_MATIN', 'MERCREDI_APRES_MIDI']),
        statut: 'DISPONIBLE',
        telephone: '+33612345678',
      });
      expect(response.body.id).toBeDefined();
    });

    it('should return 409 if email already exists', async () => {
      await prisma.formateur.create({
        data: {
          prenom: 'Existing',
          nom: 'User',
          email: 'existing@example.com',
          specialites: { set: ['JavaScript'] },
          disponibilites: { set: ['LUNDI_MATIN'] },
          statut: 'DISPONIBLE',
        },
      });

      const createFormateurDto = {
        prenom: 'Jean',
        nom: 'Dupont',
        email: 'existing@example.com',
        specialites: ['TypeScript'],
        disponibilites: ['MARDI_MATIN'],
        statut: 'DISPONIBLE',
      };

      const response = await request(app.getHttpServer())
        .post('/formateurs')
        .send(createFormateurDto)
        .expect(409);

      expect(response.body.message).toBe('Un formateur avec cet email existe déjà');
    });
  });

  describe('GET /formateurs', () => {
    beforeEach(async () => {
      // Créer des formateurs de test
      await prisma.formateur.createMany({
        data: [
          {
            prenom: 'Jean',
            nom: 'Dupont',
            email: 'jean.dupont@example.com',
            specialites: { set: ['JavaScript', 'TypeScript'] },
            disponibilites: { set: ['LUNDI_MATIN'] },
            statut: 'DISPONIBLE',
          },
          {
            prenom: 'Marie',
            nom: 'Martin',
            email: 'marie.martin@example.com',
            specialites: { set: ['React', 'Node.js'] },
            disponibilites: { set: ['MARDI_MATIN'] },
            statut: 'OCCUPE',
          },
        ],
      });
    });

    it('should return all formateurs with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/formateurs')
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.total).toBe(2);
      expect(response.body.data[0].prenom).toBe('Jean');
      expect(response.body.data[1].prenom).toBe('Marie');
    });

    it('should filter formateurs by search term', async () => {
      const response = await request(app.getHttpServer())
        .get('/formateurs')
        .query({ search: 'Jean' })
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].prenom).toBe('Jean');
    });
  });

  describe('GET /formateurs/:id', () => {
    let formateurId: string;

    beforeEach(async () => {
      const formateur = await prisma.formateur.create({
        data: {
          prenom: 'Jean',
          nom: 'Dupont',
          email: 'jean.dupont@example.com',
          specialites: { set: ['JavaScript'] },
          disponibilites: { set: ['LUNDI_MATIN'] },
          statut: 'DISPONIBLE',
        },
      });
      formateurId = formateur.id;
    });

    it('should return a formateur by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/formateurs/${formateurId}`)
        .expect(200);

      expect(response.body.id).toBe(formateurId);
      expect(response.body.prenom).toBe('Jean');
      expect(response.body.nom).toBe('Dupont');
    });

    it('should return 404 if formateur not found', async () => {
      const nonExistentId = '000000000000000000000000';
      const response = await request(app.getHttpServer())
        .get(`/formateurs/${nonExistentId}`)
        .expect(404);

      expect(response.body.message).toBe(`Formateur avec l'ID "${nonExistentId}" non trouvé`);
    });
  });

  describe('PUT /formateurs/:id', () => {
    let formateurId: string;

    beforeEach(async () => {
      const formateur = await prisma.formateur.create({
        data: {
          prenom: 'Jean',
          nom: 'Dupont',
          email: 'jean.dupont@example.com',
          specialites: { set: ['JavaScript'] },
          disponibilites: { set: ['LUNDI_MATIN'] },
          statut: 'DISPONIBLE',
        },
      });
      formateurId = formateur.id;
    });

    it('should update a formateur', async () => {
      const updateFormateurDto = {
        prenom: 'Jean-Pierre',
        specialitesToAdd: ['TypeScript'],
        specialitesToRemove: [],
      };

      const response = await request(app.getHttpServer())
        .put(`/formateurs/${formateurId}`)
        .send(updateFormateurDto)
        .expect(200);

      expect(response.body.prenom).toBe('Jean-Pierre');
      expect(response.body.specialites).toContain('JavaScript');
      expect(response.body.specialites).toContain('TypeScript');
    });

    it('should return 404 if formateur not found', async () => {
      const nonExistentId = '000000000000000000000000';
      const response = await request(app.getHttpServer())
        .put(`/formateurs/${nonExistentId}`)
        .send({ prenom: 'Updated' })
        .expect(404);

      expect(response.body.message).toBe(`Formateur avec l'ID "${nonExistentId}" non trouvé`);
    });
  });

  describe('DELETE /formateurs/:id', () => {
    let formateurId: string;

    beforeEach(async () => {
      const formateur = await prisma.formateur.create({
        data: {
          prenom: 'Jean',
          nom: 'Dupont',
          email: 'jean.dupont@example.com',
          specialites: { set: ['JavaScript'] },
          disponibilites: { set: ['LUNDI_MATIN'] },
          statut: 'DISPONIBLE',
        },
      });
      formateurId = formateur.id;
    });

    it('should delete a formateur', async () => {
      await request(app.getHttpServer())
        .delete(`/formateurs/${formateurId}`)
        .expect(200);

      // Vérifier que le formateur a bien été supprimé
      const deletedFormateur = await prisma.formateur.findUnique({
        where: { id: formateurId },
      });
      expect(deletedFormateur).toBeNull();
    });
  });

  describe('GET /formateurs/specialite/:specialite', () => {
    beforeEach(async () => {
      await prisma.formateur.createMany({
        data: [
          {
            prenom: 'Jean',
            nom: 'Dupont',
            email: 'jean.dupont@example.com',
            specialites: { set: ['JavaScript', 'TypeScript'] },
            disponibilites: { set: ['LUNDI_MATIN'] },
            statut: 'DISPONIBLE',
          },
          {
            prenom: 'Marie',
            nom: 'Martin',
            email: 'marie.martin@example.com',
            specialites: { set: ['React', 'Node.js'] },
            disponibilites: { set: ['MARDI_MATIN'] },
            statut: 'OCCUPE',
          },
        ],
      });
    });

    it('should return formateurs by specialite', async () => {
      const response = await request(app.getHttpServer())
        .get('/formateurs/specialite/JavaScript')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].prenom).toBe('Jean');
      expect(response.body[0].specialites).toContain('JavaScript');
    });
  });

  describe('GET /formateurs/disponibilite/:disponibilite', () => {
    beforeEach(async () => {
      await prisma.formateur.createMany({
        data: [
          {
            prenom: 'Jean',
            nom: 'Dupont',
            email: 'jean.dupont@example.com',
            specialites: { set: ['JavaScript'] },
            disponibilites: { set: ['LUNDI_MATIN'] },
            statut: 'DISPONIBLE',
          },
          {
            prenom: 'Marie',
            nom: 'Martin',
            email: 'marie.martin@example.com',
            specialites: { set: ['React'] },
            disponibilites: { set: ['MARDI_MATIN'] },
            statut: 'OCCUPE',
          },
        ],
      });
    });

    it('should return formateurs by disponibilite', async () => {
      const response = await request(app.getHttpServer())
        .get('/formateurs/disponibilite/LUNDI_MATIN')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].prenom).toBe('Jean');
      expect(response.body[0].disponibilites).toContain('LUNDI_MATIN');
    });
  });
});
