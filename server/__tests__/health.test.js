const request = require('supertest');
const app = require('../server');

describe('API Health Check', () => {
  it('should return 200 OK and status message on /api/health', async () => {
    const res = await request(app).get('/api/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
  });
});