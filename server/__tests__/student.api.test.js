const request = require('supertest');
const app = require('../server'); // Make sure server.js exports the app
const mongoose = require('mongoose');

describe('Student API Endpoints', () => {
  beforeAll(async () => {
    // Optionally connect to a test database if not already handled in server.js mock
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return 401 for unauthorized access to /api/students', async () => {
    const res = await request(app).get('/api/students');
    expect(res.statusCode).toEqual(401);
  });
});
