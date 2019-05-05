const request = require('supertest');
const { app } = require('../../app');

describe('Game Session Router', () => {
  describe('POST /game', () => {
    it('should create a new game and return game ID', async () => {
      const response = await request(app).post('/game');

      expect(response.statusCode).toBe(201);
      expect(response.body.data).toEqual({ gameId: 0 });
    });

    it('should create a second game and return game ID', async () => {
      const response = await request(app).post('/game');

      expect(response.statusCode).toBe(201);
      expect(response.body.data).toEqual({ gameId: 1 });
    });
  });

  describe('POST /game/:gameId/player', () => {
    it('should handle not found', async () => {
      const response = await request(app).post('/game/5/player');

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBeDefined();
      expect(response.body.data).toBeNull();
    });

    it('should add a new player to the session', async () => {
      const response = await request(app).post('/game/0/player');

      expect(response.statusCode).toBe(201);
      expect(response.body.data).toEqual({ playerId: 0 });
    });

    it('should add a second player to the session', async () => {
      const response = await request(app).post('/game/0/player');

      expect(response.statusCode).toBe(201);
      expect(response.body.data).toEqual({ playerId: 1 });
    });
  });
});
