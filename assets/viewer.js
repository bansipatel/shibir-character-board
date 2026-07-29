const boardRoot = document.getElementById('boardRoot');

const sync = createSync();

// Fullscreen toggle — handy once this is fed into the LED panel switcher.
window.addEventListener('keydown', (e) => {
  if (e.key === 'f' || e.key === 'F') {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  }
});

loadCharacterData().then(() => {
  const board = renderBoard(boardRoot, { clickable: false });
  sync.onState((state) => board.applyState(state));
});
