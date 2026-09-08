import { Chess } from '/assets/chess.js';
const $ = (id) => document.getElementById(id);
let username = null,
  current = null,
  selected = null,
  polling = false,
  busy = false,
  revision = '',
  generation = 0;
const glyphs = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };
const names = {
  k: 'king',
  q: 'queen',
  r: 'rook',
  b: 'bishop',
  n: 'knight',
  p: 'pawn',
};
function notice(message = '') {
  $('notice').textContent = message;
}
async function api(path, body) {
  const response = await fetch(`/api${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401 && username) {
      username = null;
      current = null;
      show('auth');
      $('logout').hidden = true;
    }
    throw new Error(data.error || 'Request failed.');
  }
  return data;
}
function show(id) {
  for (const section of ['auth', 'lobby', 'game'])
    $(section).hidden = section !== id;
}
async function task(fn) {
  if (busy) return;
  busy = true;
  generation++;
  notice();
  try {
    await fn();
  } catch (error) {
    notice(error.message);
  } finally {
    busy = false;
  }
}
async function lobby() {
  current = null;
  selected = null;
  revision = '';
  show('lobby');
  $('welcome').textContent = `Your games, ${username}`;
  const rooms = await api('/rooms');
  if (current || !username) return;
  $('rooms').replaceChildren();
  if (!rooms.length)
    $('rooms').textContent =
      'No games yet. Start one and invite a friend to join.';
  for (const room of rooms) {
    const row = document.createElement('div');
    row.className = 'room';
    const title = document.createElement('span');
    title.textContent = `${room.white} vs ${room.black || '…'} · ${room.status}`;
    const button = document.createElement('button');
    const mine = [room.white, room.black].includes(username);
    button.textContent = mine ? 'Open' : 'Join';
    button.onclick = () =>
      task(async () =>
        openGame(
          await api(
            `/rooms/${room.id}${mine ? '' : '/join'}`,
            mine ? undefined : {},
          ),
        ),
      );
    row.append(title, button);
    $('rooms').append(row);
  }
}
function openGame(room) {
  current = room;
  selected = null;
  revision = '';
  show('game');
  render(room);
}
function render(room) {
  current = room;
  const nextRevision = JSON.stringify(room);
  if (revision === nextRevision) return;
  revision = nextRevision;
  const chess = new Chess(room.fen);
  $('players').textContent =
    `${room.white} vs ${room.black || 'waiting for a player'}`;
  $('game-status').textContent =
    room.result ||
    (room.status === 'waiting'
      ? 'Waiting for another player. They can join from the lobby.'
      : `${chess.turn() === 'w' ? room.white : room.black} to move${chess.isCheck() ? ' — check' : ''}${room.drawOffer ? ` · Draw offered by ${room.drawOffer}` : ''}`);
  $('draw').textContent =
    room.drawOffer && room.drawOffer !== username
      ? 'Accept draw'
      : 'Offer draw';
  $('draw').disabled = room.status !== 'playing';
  $('resign').disabled = room.status === 'finished';
  $('moves').textContent = room.moves.length
    ? room.moves
        .map(
          (move, i) =>
            `${i % 2 === 0 ? `${Math.floor(i / 2) + 1}. ` : ''}${move}`,
        )
        .join(' ')
    : 'No moves yet.';
  $('messages').replaceChildren();
  for (const entry of room.messages) {
    const p = document.createElement('p');
    p.textContent = `${entry.name}: ${entry.message}`;
    $('messages').append(p);
  }
  drawBoard();
}
function drawBoard() {
  const chess = new Chess(current.fen),
    side = username === current.white ? 'w' : 'b';
  const ranks =
    side === 'w' ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];
  const files = side === 'w' ? [...'abcdefgh'] : [...'hgfedcba'];
  const moves = selected
    ? chess.moves({ square: selected, verbose: true })
    : [];
  const focus = document.activeElement?.dataset.square;
  $('board').replaceChildren();
  for (const rank of ranks)
    for (const file of files) {
      const square = `${file}${rank}`,
        piece = chess.get(square),
        button = document.createElement('button');
      button.className = `square ${(file.charCodeAt(0) + rank) % 2 === 0 ? 'dark' : ''}`;
      button.dataset.square = square;
      button.setAttribute(
        'aria-label',
        `${square}${piece ? ` ${piece.color === 'w' ? 'white' : 'black'} ${names[piece.type]}` : ' empty'}`,
      );
      button.setAttribute('aria-pressed', String(selected === square));
      if (piece) {
        const span = document.createElement('span');
        span.textContent = glyphs[piece.type];
        span.className = piece.color === 'w' ? 'white-piece' : 'black-piece';
        button.append(span);
      }
      const label = document.createElement('small');
      label.className = 'coordinate';
      label.textContent = square;
      button.append(label);
      if (selected === square) button.classList.add('selected');
      if (moves.some((m) => m.to === square)) button.classList.add('legal');
      button.onclick = () =>
        task(async () => {
          if (current.status !== 'playing' || chess.turn() !== side) return;
          if (selected && moves.some((m) => m.to === square)) {
            const room = await api(`/rooms/${current.id}/move`, {
              from: selected,
              to: square,
              promotion: $('promotion').value,
            });
            selected = null;
            render(room);
          } else {
            selected = piece?.color === side ? square : null;
            drawBoard();
          }
        });
      $('board').append(button);
    }
  if (focus)
    $('board')
      .querySelector(`[data-square="${focus}"]`)
      ?.focus({ preventScroll: true });
}
$('auth-form').onsubmit = (event) => {
  event.preventDefault();
  const intent = event.submitter?.value || 'login';
  task(async () => {
    const data = Object.fromEntries(new FormData(event.target));
    const result = await api(`/${intent}`, data);
    username = result.username;
    event.target.reset();
    $('logout').hidden = false;
    await lobby();
  });
};
$('logout').onclick = () =>
  task(async () => {
    await api('/logout', {});
    username = null;
    current = null;
    $('logout').hidden = true;
    show('auth');
  });
$('create').onclick = () => task(async () => openGame(await api('/rooms', {})));
$('back').onclick = () => task(lobby);
$('refresh').onclick = () => task(lobby);
$('chat-form').onsubmit = (event) => {
  event.preventDefault();
  task(async () => {
    const data = Object.fromEntries(new FormData(event.target));
    render(await api(`/rooms/${current.id}/chat`, data));
    event.target.reset();
  });
};
$('draw').onclick = () =>
  task(async () =>
    render(await api(`/rooms/${current.id}/finish`, { action: 'draw' })),
  );
$('resign').onclick = () => {
  if (confirm('End this game? This cannot be undone.'))
    task(async () =>
      render(await api(`/rooms/${current.id}/finish`, { action: 'resign' })),
    );
};
try {
  username = (await api('/me')).username;
  $('logout').hidden = false;
  await lobby();
} catch {
  show('auth');
}
setInterval(async () => {
  if (!username || busy || polling || document.hidden) return;
  polling = true;
  const id = current?.id,
    started = generation;
  try {
    if (id) {
      const room = await api(`/rooms/${id}`);
      if (!busy && generation === started && current?.id === id) render(room);
    }
  } catch (error) {
    notice(error.message);
  } finally {
    polling = false;
  }
}, 2000);
