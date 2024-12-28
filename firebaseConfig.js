import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  // Your Firebase configuration object goes here
  apiKey: "AIzaSyArSbcG7w9QWRVyEzjJP9plSdqz6KqAXsE",
  authDomain: "addprodct.firebaseapp.com",
  projectId: "addprodct",
  storageBucket: "addprodct.firebasestorage.app",
  messagingSenderId: "1075738055378",
  appId: "1:1075738055378:web:c852e8fadc0c814278530b",
  measurementId: "G-CC5V588V5Y"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const realtimeDb = getDatabase(app);

export { db, auth, realtimeDb };

