import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { seedDatabase } from '../src/seed/seed.js';

let studentToken = '';
let facultyToken = '';
let adminToken = '';

beforeAll(async () => {
  await connectDB();
  await seedDatabase();

  // Login Student
  const studentLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'student1@anurag.edu.in', password: 'Student@123' });
  studentToken = studentLogin.body.data.accessToken;

  // Login Faculty
  const facultyLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'faculty.cs@anurag.edu.in', password: 'Faculty@123' });
  facultyToken = facultyLogin.body.data.accessToken;

  // Login Admin
  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@anurag.edu.in', password: 'Admin@123' });
  adminToken = adminLogin.body.data.accessToken;
});

afterAll(async () => {
  await disconnectDB();
});

describe('RBAC & Multi-Tenancy Enforcement', () => {
  it('Student CANNOT create departments (requires Admin role)', async () => {
    const res = await request(app)
      .post('/api/departments')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        name: 'Unauthorized Dept',
        code: 'UNAUTH',
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('Student CAN view their own attendance summary', async () => {
    const res = await request(app)
      .get('/api/attendance/student')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.overall).toBeDefined();
    expect(res.body.data.overall.percentage).toBeGreaterThan(0);
  });

  it('Faculty CAN view their assigned subjects', async () => {
    const res = await request(app)
      .get('/api/subjects/my-subjects')
      .set('Authorization', `Bearer ${facultyToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('College Admin CAN access college dashboard statistics', async () => {
    const res = await request(app)
      .get('/api/analytics/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalStudents).toBeDefined();
    expect(res.body.data.totalFaculty).toBeDefined();
  });
});
