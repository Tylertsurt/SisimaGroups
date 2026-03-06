/* ═══════════════════════════════════════════════════════════
   SISIMA GROUP — Firebase Configuration
   ═══════════════════════════════════════════════════════════
   SETUP INSTRUCTIONS:
   1. Go to https://console.firebase.google.com
   2. Create a new project called "sisima-group"
   3. Click "Web" app icon (</>), register the app
   4. Copy the firebaseConfig values below from your project
   5. Replace EVERY placeholder value (the ones in quotes)
   ═══════════════════════════════════════════════════════════ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore }   from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth }        from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey:            "PASTE_YOUR_API_KEY_HERE",
  authDomain:        "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId:         "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket:     "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
  appId:             "PASTE_YOUR_APP_ID_HERE"
};

const app = initializeApp(firebaseConfig);

export const db   = getFirestore(app);
export const auth = getAuth(app);
