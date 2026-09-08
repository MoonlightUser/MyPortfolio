import { createApp } from './app.js';
import { createStore } from './store.js';
const port = Number(process.env.PORT || 3000);
const origin = process.env.APP_ORIGIN || `http://localhost:${port}`;
const secure = process.env.COOKIE_SECURE === 'true';
if (
  process.env.NODE_ENV === 'production' &&
  (!origin.startsWith('https://') || !secure)
) {
  throw new Error(
    'Production requires an HTTPS APP_ORIGIN and COOKIE_SECURE=true.',
  );
}
const store = createStore(process.env.DATABASE_PATH || 'data/chess.sqlite');
const server = createApp({ store, origin, secure }).listen(
  port,
  process.env.HOST || '127.0.0.1',
  () => console.log(`Portfolio: ${origin}`),
);
for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, () =>
    server.close(() => {
      store.close();
      process.exit(0);
    }),
  );
