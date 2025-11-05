const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');
const Event = require('../models/Event');

let mongoServer;
let token1, token2;
let user1Id, user2Id;
let event1Id, event2Id;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create test users
  const user1 = new User({
    username: 'user1',
    email: 'user1@example.com',
    password: 'password123'
  });
  await user1.save();
  user1Id = user1._id;

  const user2 = new User({
    username: 'user2',
    email: 'user2@example.com',
    password: 'password123'
  });
  await user2.save();
  user2Id = user2._id;

  // Get tokens
  const res1 = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'user1@example.com',
      password: 'password123'
    });
  token1 = res1.body.token;

  const res2 = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'user2@example.com',
      password: 'password123'
    });
  token2 = res2.body.token;

  // Create events
  const event1 = new Event({
    user: user1Id,
    title: 'Event 1',
    description: 'Description 1',
    startTime: new Date('2023-12-01T10:00:00.000Z'),
    endTime: new Date('2023-12-01T11:00:00.000Z'),
    status: 'SWAPPABLE'
  });
  await event1.save();
  event1Id = event1._id;

  const event2 = new Event({
    user: user2Id,
    title: 'Event 2',
    description: 'Description 2',
    startTime: new Date('2023-12-01T14:00:00.000Z'),
    endTime: new Date('2023-12-01T15:00:00.000Z'),
    status: 'SWAPPABLE'
  });
  await event2.save();
  event2Id = event2._id;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Swaps API', () => {
  it('should create a swap request', async () => {
    const res = await request(app)
      .post('/api/swaps')
      .set('Authorization', token1)
      .send({
        requestedEventId: event2Id,
        offeredEventId: event1Id
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('should accept a swap request', async () => {
    // First create a swap request
    const createRes = await request(app)
      .post('/api/swaps')
      .set('Authorization', token1)
      .send({
        requestedEventId: event2Id,
        offeredEventId: event1Id
      });
    const swapId = createRes.body._id;

    // Then accept it
    const res = await request(app)
      .put(`/api/swaps/${swapId}`)
      .set('Authorization', token2)
      .send({
        status: 'ACCEPTED'
      });
    expect(res.statusCode).toEqual(200);
  });
});
