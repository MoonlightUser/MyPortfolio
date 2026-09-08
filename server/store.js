import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export function createStore(filename = ':memory:') {
  if (filename !== ':memory:')
    mkdirSync(dirname(filename), { recursive: true });
  const db = new DatabaseSync(filename);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS users (name TEXT PRIMARY KEY COLLATE NOCASE, password TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (digest TEXT PRIMARY KEY, username TEXT NOT NULL REFERENCES users(name), expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS rooms (id TEXT PRIMARY KEY, state TEXT NOT NULL);
  `);
  return {
    db,
    user(name) {
      return db.prepare('SELECT * FROM users WHERE name = ?').get(name);
    },
    addUser(name, password) {
      db.prepare('INSERT INTO users VALUES (?, ?)').run(name, password);
    },
    addSession(digest, name, expires) {
      db.prepare('DELETE FROM sessions WHERE expires <= ?').run(Date.now());
      db.prepare('INSERT INTO sessions VALUES (?, ?, ?)').run(
        digest,
        name,
        expires,
      );
    },
    session(digest) {
      return db
        .prepare(
          'SELECT username FROM sessions WHERE digest = ? AND expires > ?',
        )
        .get(digest, Date.now());
    },
    logout(digest) {
      db.prepare('DELETE FROM sessions WHERE digest = ?').run(digest);
    },
    room(id) {
      const row = db.prepare('SELECT state FROM rooms WHERE id = ?').get(id);
      return row && JSON.parse(row.state);
    },
    rooms() {
      return db
        .prepare('SELECT state FROM rooms')
        .all()
        .map((row) => JSON.parse(row.state));
    },
    save(room) {
      db.prepare(
        'INSERT INTO rooms VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET state=excluded.state',
      ).run(room.id, JSON.stringify(room));
    },
    // Mutations are synchronous: read, validation and write cannot interleave within this process.
    close() {
      db.close();
    },
  };
}
