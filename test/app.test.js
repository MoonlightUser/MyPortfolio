import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../server/app.js';
import { createStore } from '../server/store.js';
import { digest } from '../server/security.js';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

async function fixture(t, options = {}) {
  const store = createStore();
  const app = createApp({ store, origin: 'http://localhost:3000', ...options });
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(() => {
    server.closeAllConnections();
    server.close();
    store.close();
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  async function request(
    path,
    body,
    cookie = '',
    origin = 'http://localhost:3000',
  ) {
    const res = await fetch(base + path, {
      method: body === undefined ? 'GET' : 'POST',
      headers: { cookie, origin, 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      redirect: 'manual',
    });
    const value = await res.text();
    let data;
    try {
      data = JSON.parse(value);
    } catch {
      data = value;
    }
    return {
      status: res.status,
      data,
      cookie: res.headers.get('set-cookie')?.split(';')[0],
      headers: res.headers,
    };
  }
  async function register(username) {
    return (
      await request('/api/register', {
        username,
        password: 'a-long-unique-password',
      })
    ).cookie;
  }
  return { store, request, register };
}
test('registration hashes passwords and uses an HttpOnly cookie; sessions can be revoked', async (t) => {
  const { request, store } = await fixture(t);
  const result = await request('/api/register', {
    username: 'Alice',
    password: 'a-long-unique-password',
  });
  assert.equal(result.status, 201);
  assert.match(result.headers.get('set-cookie'), /HttpOnly/);
  assert.match(result.headers.get('set-cookie'), /SameSite=Strict/);
  assert.notEqual(store.user('Alice').password, 'a-long-unique-password');
  assert.deepEqual(result.data, { username: 'Alice' });
  assert.equal(
    (await request('/api/me', undefined, result.cookie)).status,
    200,
  );
  await request('/api/logout', {}, result.cookie);
  assert.equal(
    (await request('/api/me', undefined, result.cookie)).status,
    401,
  );
});
test('invalid inputs, duplicate names, wrong passwords and cross-origin requests are rejected', async (t) => {
  const { request, register } = await fixture(t);
  assert.equal(
    (await request('/api/register', { username: '<script>', password: 'tiny' }))
      .status,
    400,
  );
  await register('Alice');
  assert.equal(
    (
      await request('/api/register', {
        username: 'alice',
        password: 'a-long-unique-password',
      })
    ).status,
    409,
  );
  assert.equal(
    (await request('/api/login', { username: 'Alice', password: 'wrong' }))
      .status,
    401,
  );
  assert.equal(
    (await request('/api/login', { username: 'Nobody', password: 'wrong' }))
      .status,
    401,
  );
  assert.equal(
    (
      await request('/api/login', {
        username: 'Alice',
        password: 'a-long-unique-password',
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await request(
        '/api/register',
        { username: 'Mallory', password: 'a-long-unique-password' },
        '',
        'https://other.example',
      )
    ).status,
    403,
  );
});
test('expired and invented sessions are rejected', async (t) => {
  const { request, register, store } = await fixture(t);
  const cookie = await register('Alice');
  store.db
    .prepare('UPDATE sessions SET expires = 0 WHERE digest = ?')
    .run(digest(cookie.slice(8)));
  assert.equal((await request('/api/me', undefined, cookie)).status, 401);
  assert.equal(
    (await request('/api/me', undefined, 'session=forged')).status,
    401,
  );
});
test('only two players can join and outsiders cannot read or mutate a room', async (t) => {
  const { request, register } = await fixture(t);
  const alice = await register('Alice'),
    bob = await register('Bob'),
    outsider = await register('Mallory');
  const room = (await request('/api/rooms', {}, alice)).data;
  const url = `/api/rooms/${room.id}`;
  assert.equal((await request(url, undefined, outsider)).status, 403);
  assert.equal((await request(url + '/join', {}, bob)).status, 200);
  assert.equal((await request(url + '/join', {}, outsider)).status, 409);
  for (const path of ['move', 'chat', 'finish'])
    assert.equal((await request(`${url}/${path}`, {}, outsider)).status, 403);
  assert.equal(
    (await request(url + '/move', { from: 'e7', to: 'e5' }, bob)).status,
    403,
  );
  assert.equal(
    (await request(url + '/move', { from: 'e2', to: 'e5' }, alice)).status,
    400,
  );
  assert.equal(
    (await request(url + '/move', { from: 'e2', to: 'e4' }, alice)).status,
    200,
  );
  assert.equal(
    (await request(url + '/move', { from: 'd2', to: 'd4' }, alice)).status,
    403,
  );
  assert.equal(
    (await request(url + '/move', { from: 'e7', to: 'e5' }, bob)).status,
    200,
  );
  assert.deepEqual((await request(url, undefined, alice)).data.moves, [
    'e4',
    'e5',
  ]);
});
test('simultaneous joins cannot overwrite the second player', async (t) => {
  const { request, register } = await fixture(t);
  const a = await register('Alice'),
    b = await register('Bob'),
    c = await register('Carol');
  const room = (await request('/api/rooms', {}, a)).data;
  const results = await Promise.all([
    request(`/api/rooms/${room.id}/join`, {}, b),
    request(`/api/rooms/${room.id}/join`, {}, c),
  ]);
  assert.deepEqual(results.map((x) => x.status).sort(), [200, 409]);
});
test('checkmate is authoritative and completed games reject moves', async (t) => {
  const { request, register } = await fixture(t);
  const a = await register('Alice'),
    b = await register('Bob');
  const room = (await request('/api/rooms', {}, a)).data,
    url = `/api/rooms/${room.id}`;
  await request(url + '/join', {}, b);
  for (const [from, to, cookie] of [
    ['f2', 'f3', a],
    ['e7', 'e5', b],
    ['g2', 'g4', a],
    ['d8', 'h4', b],
  ])
    assert.equal(
      (await request(url + '/move', { from, to }, cookie)).status,
      200,
    );
  const result = (await request(url, undefined, a)).data;
  assert.equal(result.status, 'finished');
  assert.equal(result.result, 'Bob wins by checkmate');
  assert.equal(
    (await request(url + '/move', { from: 'a2', to: 'a3' }, a)).status,
    409,
  );
});
test('chat identity is server-assigned and draws require the other player', async (t) => {
  const { request, register } = await fixture(t);
  const a = await register('Alice'),
    b = await register('Bob');
  const room = (await request('/api/rooms', {}, a)).data,
    url = `/api/rooms/${room.id}`;
  await request(url + '/join', {}, b);
  const chat = await request(
    url + '/chat',
    { name: 'Bob', message: '<b>test</b>' },
    a,
  );
  assert.deepEqual(chat.data.messages, [
    { name: 'Alice', message: '<b>test</b>' },
  ]);
  assert.equal(
    (await request(url + '/chat', { message: 'x'.repeat(501) }, a)).status,
    400,
  );
  await request(url + '/finish', { action: 'draw' }, a);
  assert.equal(
    (await request(url + '/finish', { action: 'draw' }, a)).data.status,
    'playing',
  );
  assert.equal(
    (await request(url + '/finish', { action: 'draw' }, b)).data.result,
    'Draw by agreement',
  );
});
test('rate limits and game quotas apply', async (t) => {
  const { request, register } = await fixture(t, { authLimit: 2 });
  const a = await register('Alice');
  await register('Bob');
  assert.equal(
    (
      await request('/api/register', {
        username: 'Carol',
        password: 'a-long-unique-password',
      })
    ).status,
    429,
  );
  for (let i = 0; i < 3; i++)
    assert.equal((await request('/api/rooms', {}, a)).status, 201);
  assert.equal((await request('/api/rooms', {}, a)).status, 409);
});
test('SQLite state survives closing and reopening the database', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tymur-chess-test-')),
    filename = join(dir, 'test.sqlite');
  let store;
  try {
    store = createStore(filename);
    store.addUser('Alice', 'test-hash');
    store.save({ id: 'room', moves: ['e4'] });
    store.close();
    store = createStore(filename);
    assert.equal(store.user('Alice').password, 'test-hash');
    assert.deepEqual(store.room('room').moves, ['e4']);
  } finally {
    store?.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
test('portfolio is served and retired API/dependency paths are inaccessible', async (t) => {
  const { request, register } = await fixture(t);
  const a = await register('Alice');
  assert.equal((await request('/')).status, 200);
  assert.equal((await request('/chess/')).status, 200);
  assert.equal((await request('/assets/chess.js')).status, 200);
  for (const path of [
    '/node_modules/express/package.json',
    '/projects/diplom-chess/public/package.json',
    '/database/get-users.php',
    '/.env',
  ])
    assert.equal((await request(path)).status, 404);
  assert.equal((await request('/api/get-users', {}, a)).status, 404);
});
