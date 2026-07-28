// ============================================================================
// FIREBASE CONFIG — required for syncing the Admin and Viewer across TWO
// SEPARATE DEVICES on the same network. See README.md for the 5-minute
// setup (free Firebase project, Realtime Database in "test mode").
//
// Until you fill this in, the app automatically runs in LOCAL DEMO MODE:
// Admin and Viewer will still sync, but only as two tabs/windows on the
// SAME computer (using BroadcastChannel). Great for building/rehearsing
// the flow before you set up Firebase.
// ============================================================================

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyA9kHZbO_0G4-57FXHM1KLWrOGz6-p24Wk",
  authDomain: "historical-figures-e91f1.firebaseapp.com",
  databaseURL: "https://historical-figures-e91f1-default-rtdb.firebaseio.com",
  projectId: "historical-figures-e91f1",
};

// Room code — lets you reuse the same Firebase project for multiple
// rehearsals/events without them colliding. Change it any time; just make
// sure Admin and Viewer are opened with the same ?room= value.
const DEFAULT_ROOM_CODE = "shibir";
