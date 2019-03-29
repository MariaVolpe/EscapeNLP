const request = require('supertest');
const app = require('../../app');

describe('Game Session Router', () => {
  describe('POST /game', () => {
    it('should create a new game and return game ID', async () => {
      const response = await request(app).post('/game');

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ gameId: 0 });
    });

    it('should create a second game and return game ID', async () => {
      const response = await request(app).post('/game');

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ gameId: 1 });
    });
  });

  describe('DELETE /game', () => {
    it('should return handle not found', async () => {
      const response = await request(app).delete('/game/5');

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({});
    });

    it('should delete a game by ID', async () => {
      const response = await request(app).delete('/game/1');

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
      // check games exist
    });
  });

  describe('POST /game/:gameId/player', () => {
    it('should return handle not found', async () => {
      const response = await request(app).post('/game/5/player');

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({});
    });

    it('should add a new player to the session', async () => {
      const response = await request(app).post('/game/0/player');

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ playerId: 0 });
    });

    it('should add a second player to the session', async () => {
      const response = await request(app).post('/game/0/player');

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ playerId: 1 });
    });
  });

  describe('GET /game', () => {
    it('should return all games in session and their player counts', async () => {
      const response = await request(app).get('/game');

      const expected = [{
        gameId: 0,
        playerCount: 2,
      }];

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expected);
    });
  });

  describe('GET /game/:gameId', () => {
    it('should handle not found', async () => {
      const response = await request(app).get('/game/5');

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({});
    });

    it('should return game', async () => {
      const response = await request(app).get('/game/0');

      expect(response.statusCode).toBe(200);
      expect(response.body.game.id).toEqual(0);
      expect(response.body.game.grid).toBeDefined();
      expect(response.body.game.players).toBeInstanceOf(Array);
      expect(response.body.game.players.length).toEqual(2);
    });
  });

  describe('DELETE /game/:gameId/player/:playerId', () => {
    it('should return handle session not found', async () => {
      const response = await request(app).delete('/game/5/player/1');

      expect(response.statusCode).toBe(404);
      expect(response.body.source).toEqual('gameId');
    });

    it('should return handle player not found', async () => {
      const response = await request(app).delete('/game/0/player/5');

      expect(response.statusCode).toBe(404);
      expect(response.body.source).toEqual('playerId');
    });

    it('should delete a player from a session', async () => {
      const response = await request(app).delete('/game/0/player/1');

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
      // check games exist
    });
  });
});
