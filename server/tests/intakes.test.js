import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import intakesRouter from '../routes/intakes.js';
import db from '../database.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/intakes', intakesRouter);

// Test admin password
const ADMIN_PASSWORD = 'test-admin-password';
process.env.ADMIN_PASSWORD = ADMIN_PASSWORD;

// Helper to create basic auth header
function createAuthHeader(password) {
  const credentials = Buffer.from(`admin:${password}`).toString('base64');
  return `Basic ${credentials}`;
}

describe('Intake API Tests', () => {
  before(() => {
    // Clean up test data
    db.prepare('DELETE FROM intakes').run();
  });

  after(() => {
    // Clean up test data
    db.prepare('DELETE FROM intakes').run();
  });

  // Test 1: Create intake (happy path)
  it('should create an intake successfully', async () => {
    const intakeData = {
      name: 'John Doe',
      email: 'john@example.com',
      description: 'I need help with my invoice',
      urgency: 3
    };

    const response = await request(app)
      .post('/api/intakes')
      .send(intakeData)
      .expect(201);

    assert.strictEqual(response.body.message, 'Intake created successfully');
    assert.ok(response.body.data);
    assert.strictEqual(response.body.data.name, intakeData.name);
    assert.strictEqual(response.body.data.email, intakeData.email);
    assert.strictEqual(response.body.data.description, intakeData.description);
    assert.strictEqual(response.body.data.urgency, intakeData.urgency);
    assert.strictEqual(response.body.data.status, 'new');
    assert.ok(['billing', 'technical_support', 'new_matter_project', 'other'].includes(response.body.data.category));
  });

  // Test 2: Create intake (validation fail)
  it('should return 400 for invalid intake data', async () => {
    const invalidData = {
      name: '',
      email: 'invalid-email',
      description: '',
      urgency: 10 // Invalid urgency
    };

    const response = await request(app)
      .post('/api/intakes')
      .send(invalidData)
      .expect(400);

    assert.strictEqual(response.body.error, 'Validation Error');
    assert.ok(Array.isArray(response.body.errors));
    assert.ok(response.body.errors.length > 0);
  });

  // Test 3: Protected route requires auth
  it('should require authentication for GET /api/intakes', async () => {
    // Try without auth
    await request(app)
      .get('/api/intakes')
      .expect(401);

    // Try with wrong password
    await request(app)
      .get('/api/intakes')
      .set('Authorization', createAuthHeader('wrong-password'))
      .expect(401);

    // Try with correct password
    const response = await request(app)
      .get('/api/intakes')
      .set('Authorization', createAuthHeader(ADMIN_PASSWORD))
      .expect(200);

    assert.ok(Array.isArray(response.body.data));
  });
});

