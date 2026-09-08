import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { Chess } from 'chess.js';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createStore } from './store.js';
import {
  hashPassword,
  verifyPassword,
  sessionToken,
  digest,
  cookieToken,
} from './security.js';

const publicDir = fileURLToPath(new URL('../blog/', import.meta.url));
const chessModule = fileURLToPath(
  new URL('../node_modules/chess.js/dist/esm/chess.js', import.meta.url),
);
const fail = (status, message) => {
  throw Object.assign(new Error(message), { status });
};
const text = (value, max) =>
  typeof value === 'string' && value.length > 0 && value.length <= max;
const view = (room) => ({ ...room, moves: room.moves });

export function createApp({
  store = createStore(),
  origin = 'http://localhost:3000',
  secure = false,
  authLimit = 30,
} = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use((req, res, next) => {
    res.set({
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'same-origin',
      'X-Frame-Options': 'DENY',
    });
    if (req.path.startsWith('/api/')) {
      res.set('Cache-Control', 'no-store');
      if (
        req.method !== 'GET' &&
        (req.headers.origin !== origin || !req.is('application/json'))
      ) {
        return res
          .status(403)
          .json({ error: 'Use a same-origin JSON request.' });
      }
    }
    next();
  });
  app.use('/api', express.json({ limit: '8kb' }));
  app.use(
    '/api',
    rateLimit({
      windowMs: 60_000,
      limit: 240,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: { error: 'Too many requests. Try again shortly.' },
    }),
  );
  const authenticationLimit = rateLimit({
    windowMs: 900_000,
    limit: authLimit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many sign-in attempts. Try again in 15 minutes.' },
  });
  app.use(['/api/register', '/api/login'], authenticationLimit);
  const sessionOptions = {
    httpOnly: true,
    sameSite: 'strict',
    secure,
    path: '/',
    maxAge: 10 * 60 * 60 * 1000,
  };
  const login = (res, name) => {
    const token = sessionToken();
    store.addSession(digest(token), name, Date.now() + sessionOptions.maxAge);
    res.cookie('session', token, sessionOptions);
    return res.json({ username: name });
  };
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.post('/api/register', async (req, res) => {
    const { username, password } = req.body || {};
    if (
      !text(username, 20) ||
      !/^[A-Za-z0-9_-]{3,20}$/.test(username) ||
      !text(password, 128) ||
      password.length < 12
    )
      fail(
        400,
        'Use a 3-20 character username and a 12-128 character password.',
      );
    if (store.user(username)) fail(409, 'Username unavailable.');
    const encoded = await hashPassword(password);
    // Recheck after the asynchronous hash to handle simultaneous registrations.
    if (store.user(username)) fail(409, 'Username unavailable.');
    store.addUser(username, encoded);
    res.status(201);
    return login(res, username);
  });
  app.post('/api/login', async (req, res) => {
    const { username, password } = req.body || {};
    if (!text(username, 20) || !text(password, 128))
      fail(400, 'Enter your username and password.');
    const user = store.user(username);
    const valid = await verifyPassword(
      password,
      user?.password || `${'0'.repeat(32)}:${'0'.repeat(128)}`,
    );
    if (!user || !valid) fail(401, 'Incorrect username or password.');
    store.logout(digest(cookieToken(req)));
    return login(res, user.name);
  });
  app.post('/api/logout', (req, res) => {
    store.logout(digest(cookieToken(req)));
    res.clearCookie('session', {
      httpOnly: true,
      sameSite: 'strict',
      secure,
      path: '/',
    });
    res.json({ ok: true });
  });
  app.use('/api', (req, res, next) => {
    const session = store.session(digest(cookieToken(req)));
    if (!session) return res.status(401).json({ error: 'Please sign in.' });
    req.username = session.username;
    next();
  });
  app.get('/api/me', (req, res) => res.json({ username: req.username }));
  app.get('/api/rooms', (req, res) =>
    res.json(
      store
        .rooms()
        .filter(
          (r) =>
            r.white === req.username ||
            r.black === req.username ||
            r.status === 'waiting',
        )
        .map((r) => ({
          id: r.id,
          white: r.white,
          black: r.black,
          status: r.status,
        })),
    ),
  );
  app.post('/api/rooms', (req, res) => {
    if (
      store
        .rooms()
        .filter((r) => r.white === req.username && r.status !== 'finished')
        .length >= 3
    )
      fail(409, 'Finish an existing game before creating another.');
    const room = {
      id: randomUUID(),
      white: req.username,
      black: null,
      status: 'waiting',
      moves: [],
      fen: new Chess().fen(),
      messages: [],
      result: null,
      drawOffer: null,
    };
    store.save(room);
    res.status(201).json(view(room));
  });
  app.post('/api/rooms/:id/join', (req, res) => {
    const room = store.room(req.params.id);
    if (!room) fail(404, 'Game not found.');
    if (room.white === req.username || room.black === req.username)
      return res.json(view(room));
    if (room.status !== 'waiting' || room.black)
      fail(409, 'This game already has two players.');
    room.black = req.username;
    room.status = 'playing';
    store.save(room);
    res.json(view(room));
  });
  app.use('/api/rooms/:id', (req, res, next) => {
    const room = store.room(req.params.id);
    if (!room) return res.status(404).json({ error: 'Game not found.' });
    if (![room.white, room.black].includes(req.username))
      return res
        .status(403)
        .json({ error: 'Only players can access this game.' });
    req.room = room;
    next();
  });
  app.get('/api/rooms/:id', (req, res) => res.json(view(req.room)));
  app.post('/api/rooms/:id/move', (req, res) => {
    const room = req.room;
    if (room.status !== 'playing') fail(409, 'The game is not active.');
    const chess = new Chess();
    for (const move of room.moves) chess.move(move);
    if ((chess.turn() === 'w' ? room.white : room.black) !== req.username)
      fail(403, 'It is not your turn.');
    const { from, to, promotion = 'q' } = req.body || {};
    if (
      !/^[a-h][1-8]$/.test(from || '') ||
      !/^[a-h][1-8]$/.test(to || '') ||
      !['q', 'r', 'b', 'n'].includes(promotion)
    )
      fail(400, 'Invalid move.');
    let move;
    try {
      move = chess.move({ from, to, promotion });
    } catch {
      fail(400, 'That move is not legal.');
    }
    room.moves.push(move.san);
    room.fen = chess.fen();
    room.drawOffer = null;
    if (chess.isGameOver()) {
      room.status = 'finished';
      room.result = chess.isCheckmate()
        ? `${req.username} wins by checkmate`
        : 'Draw';
    }
    store.save(room);
    res.json(view(room));
  });
  app.post('/api/rooms/:id/chat', (req, res) => {
    if (!text(req.body?.message, 500) || !req.body.message.trim())
      fail(400, 'Use 1-500 characters.');
    req.room.messages.push({
      name: req.username,
      message: req.body.message.trim(),
    });
    req.room.messages = req.room.messages.slice(-100);
    store.save(req.room);
    res.json(view(req.room));
  });
  app.post('/api/rooms/:id/finish', (req, res) => {
    const room = req.room;
    if (room.status === 'finished') return res.json(view(room));
    if (req.body?.action === 'resign') {
      room.status = 'finished';
      room.result = room.black
        ? `${req.username === room.white ? room.black : room.white} wins by resignation`
        : 'Game cancelled';
    } else if (req.body?.action === 'draw' && room.status === 'playing') {
      if (room.drawOffer && room.drawOffer !== req.username) {
        room.status = 'finished';
        room.result = 'Draw by agreement';
      } else room.drawOffer = req.username;
    } else fail(400, 'Invalid action.');
    store.save(room);
    res.json(view(room));
  });
  app.use('/api', (req, res) =>
    res.status(404).json({ error: 'Endpoint not found.' }),
  );
  app.get('/assets/chess.js', (req, res) => res.sendFile(chessModule));
  app.get(
    [
      '/projects/diplom-chess/public/main.html',
      '/projects/diplom-chess/public/pages/:page',
    ],
    (req, res) => res.redirect('/chess/'),
  );
  // Never serve dependency trees or retired backend files from old local checkouts.
  app.use((req, res, next) => {
    if (
      /node_modules|vendor|\.php$|package(?:-lock)?\.json$|projects\/diplom-chess/i.test(
        req.path,
      )
    )
      return res.sendStatus(404);
    next();
  });
  app.use(express.static(publicDir, { dotfiles: 'deny' }));
  app.use((req, res) => res.status(404).send('Page not found. Return to /'));
  app.use((err, req, res, next) => {
    const status = err.status >= 400 && err.status < 600 ? err.status : 500;
    if (status === 500) console.error('Request failed:', err.code || err.name);
    res.status(status).json({
      error:
        status === 500
          ? 'Something went wrong. Please try again.'
          : err.message,
    });
  });
  return app;
}
