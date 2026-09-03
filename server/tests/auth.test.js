import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { seedDatabase } from '../src/seed/seed.js';

beforeAll(async () => {
  await connectDB();
  await seedDatabase();
});

afterAll(async () => {
  await disconnectDB();
});

describe('Authentication & Security API', () => {
  it('GET /api/health returns 200 OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('POST /api/auth/login with valid superadmin credentials returns tokens and user data', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'superadmin@campusflow.edu',
        password: 'Admin@123',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.role).toBe('SUPER_ADMIN');
  });

  it('POST /api/auth/login with invalid password returns 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'superadmin@campusflow.edu',
        password: 'WrongPassword!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/login with non-existent user returns 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nobody@nowhere.edu',
        password: 'Password@123',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
