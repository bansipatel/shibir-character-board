// ============================================================================
// SYNC LAYER — one small abstraction, two backends:
//   1. FirebaseBackend — real-time sync across separate devices/network,
//      used automatically once you fill in assets/firebase-config.js.
//   2. LocalBackend     — BroadcastChannel + localStorage, used automatically
//      as a fallback so the app works with zero setup, same machine only.
//
// Both backends expose the same tiny interface:
//   sync.setState({ selected, revealed })
//   sync.onState(cb)         -> cb(state) whenever state changes
//   sync.onConnection(cb)    -> cb(isConnected: boolean)
// ============================================================================

function getRoomCode() {
  const params = new URLSearchParams(location.search);
  return params.get('room') || localStorage.getItem('shibir_room') || DEFAULT_ROOM_CODE;
}

function isFirebaseConfigured() {
  return FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.apiKey !== 'YOUR_API_KEY' && !!FIREBASE_CONFIG.databaseURL;
}

function createLocalBackend(roomCode) {
  const channel = ('BroadcastChannel' in window) ? new BroadcastChannel('shibir-sync-' + roomCode) : null;
  const storageKey = 'shibir_state_' + roomCode;
  const stateListeners = [];
  const connListeners = [];

  function readState() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || { selected: null, revealed: null };
    } catch (e) {
      return { selected: null, revealed: null };
    }
  }

  if (channel) {
    channel.onmessage = (ev) => stateListeners.forEach((cb) => cb(ev.data));
  }
  window.addEventListener('storage', (ev) => {
    if (ev.key === storageKey) stateListeners.forEach((cb) => cb(readState()));
  });

  // Local mode is always "connected" — there's no network hop to lose.
  setTimeout(() => connListeners.forEach((cb) => cb(true)), 0);

  return {
    mode: 'local',
    setState(state) {
      localStorage.setItem(storageKey, JSON.stringify(state));
      if (channel) channel.postMessage(state);
    },
    onState(cb) {
      stateListeners.push(cb);
      cb(readState());
    },
    onConnection(cb) {
      connListeners.push(cb);
      cb(true);
    },
  };
}

function createFirebaseBackend(roomCode) {
  firebase.initializeApp(FIREBASE_CONFIG);
  const db = firebase.database();
  const stateRef = db.ref('rooms/' + roomCode + '/state');
  const connRef = db.ref('.info/connected');

  return {
    mode: 'firebase',
    setState(state) {
      stateRef.set(state);
    },
    onState(cb) {
      stateRef.on('value', (snap) => {
        cb(snap.val() || { selected: null, revealed: null });
      });
    },
    onConnection(cb) {
      connRef.on('value', (snap) => cb(!!snap.val()));
    },
  };
}

function createSync() {
  const roomCode = getRoomCode();
  localStorage.setItem('shibir_room', roomCode);
  const backend = isFirebaseConfigured() ? createFirebaseBackend(roomCode) : createLocalBackend(roomCode);
  console.log('[shibir] sync backend:', backend.mode, '| room:', roomCode);
  return { ...backend, roomCode };
}
