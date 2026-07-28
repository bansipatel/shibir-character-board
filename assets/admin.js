const connDot = document.getElementById('connDot');
const connText = document.getElementById('connText');
const boardRoot = document.getElementById('boardRoot');

const sync = createSync();
let currentState = { selected: null, revealed: null };

function pushState(state) {
  currentState = state;
  sync.setState(state);
  board.applyState(state);
}

function onTileClick(name, opts) {
  if (opts && opts.reset) {
    pushState({ selected: null, revealed: null });
    return;
  }
  if (currentState.selected === name && !currentState.revealed) {
    pushState({ selected: name, revealed: name });
  } else if (currentState.selected !== name) {
    pushState({ selected: name, revealed: null });
  }
  // Clicking the already-revealed tile again is a no-op — use the backdrop to reset.
}

const board = renderBoard(boardRoot, { clickable: true, onTileClick });

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') pushState({ selected: null, revealed: null });
});

sync.onState((state) => {
  currentState = state || { selected: null, revealed: null };
  board.applyState(currentState);
});

sync.onConnection((connected) => {
  connDot.classList.toggle('connected', connected);
  connText.textContent = (sync.mode === 'local' ? 'local (' : 'network (') + sync.roomCode + ') ' + (connected ? 'synced' : 'offline');
});

board.applyState(currentState);
