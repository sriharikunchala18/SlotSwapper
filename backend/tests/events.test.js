const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create a test user
  const user = new User({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  });
  await user.save();
  userId = user._id;

  // Get token
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: 'password123'
    });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Events API', () => {
  it('should create a new event', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', token)
      .send({
        title: 'Test Event',
        description: 'Test Description',
        startTime: '2023-12-01T10:00:00.000Z',
        endTime: '2023-12-01T11:00:00.000Z',
        status: 'BUSY'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('should get user events', async () => {
    const res = await request(app)
      .get('/api/events')
      .set('Authorization', token);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
