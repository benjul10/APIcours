const request = require('supertest');
const mockingoose = require('mockingoose');
const express = require('express');
const bodyParser = require('body-parser');

const Article = require('../articles/articles.schema');
const controller = require('../articles/articles.controller');

// App de test minimaliste (pas ton vrai server.js)
const app = express();
app.use(bodyParser.json());

// mock io pour éviter les erreurs sur req.io.emit(...)
app.set('io', { emit: () => {} });

// Faux auth pour injecter req.user selon le scénario
function fakeAuth(user) {
  return (req, res, next) => { req.user = user; next(); };
}

const router = express.Router();

// Routes testées : create, update, delete
router.post('/',  fakeAuth({ _id: 'u1', role: 'user'  }), controller.create);
router.put('/:id', fakeAuth({ _id: 'a1', role: 'admin' }), controller.update);
router.delete('/:id', fakeAuth({ _id: 'a1', role: 'admin' }), controller.remove);

app.use('/api/articles', router);

describe('Articles API', () => {
  beforeEach(() => mockingoose.resetAll());

  test('POST /api/articles -> 201 (création)', async () => {
    const created = { _id: 'art1', title: 'Hello', content: 'World', status: 'draft', author: 'u1' };
    mockingoose(Article).toReturn(created, 'create');

    const res = await request(app)
      .post('/api/articles')
      .send({ title: 'Hello', content: 'World', status: 'draft' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ _id: 'art1', title: 'Hello', author: 'u1' });
  });

  test('PUT /api/articles/:id -> 200 (mise à jour)', async () => {
    const updated = { _id: 'art1', title: 'Updated', content: 'New', status: 'published', author: 'u1' };
    mockingoose(Article).toReturn(updated, 'findOneAndUpdate');

    const res = await request(app)
      .put('/api/articles/art1')
      .send({ title: 'Updated', content: 'New', status: 'published' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated');
    expect(res.body.status).toBe('published');
  });

  test('DELETE /api/articles/:id -> 204 (suppression)', async () => {
    const deleted = { _id: 'art1' };
    mockingoose(Article).toReturn(deleted, 'findOneAndDelete');

    const res = await request(app).delete('/api/articles/art1');
    expect(res.status).toBe(204);
    expect(res.text).toBe('');
  });
});
