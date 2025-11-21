import request from 'supertest';
import { app } from '../../src/app';
import { UserRole } from '@domain/users/enums/user-role.enum';

describe('User Routes', () => {
  // Données de test
  const testUser = {
    email: 'test@example.com',
    password: 'Test123!',
    firstName: 'Test',
    lastName: 'User',
    role: UserRole.USER,
  };

  let authToken: string;
  let userId: string;

  // Avant tous les tests, créer un utilisateur de test et obtenir un token
  beforeAll(async () => {
    // Créer un utilisateur de test
    const res = await request(app)
      .post('/api/users')
      .send(testUser);
      
    userId = res.body.id;
    
    // Se connecter pour obtenir un token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });
      
    authToken = loginRes.body.token;
  });

  // Tester la récupération du profil utilisateur
  describe('GET /users/profile', () => {
    it('devrait retourner le profil de l\'utilisateur connecté', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);
        
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', testUser.email);
    });

    it('devrait retourner une erreur 401 si non authentifié', async () => {
      const res = await request(app)
        .get('/api/users/profile');
        
      expect(res.status).toBe(401);
    });
  });

  // Tester la mise à jour d'un utilisateur
  describe('PUT /users/:id', () => {
    it('devrait mettre à jour l\'utilisateur', async () => {
      const updatedData = { firstName: 'Updated' };
      
      const res = await request(app)
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData);
        
      expect(res.status).toBe(200);
      expect(res.body.firstName).toBe(updatedData.firstName);
    });
  });

  // Nettoyage après les tests
  afterAll(async () => {
    // Supprimer l'utilisateur de test
    await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);
  });
});
