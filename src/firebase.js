import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDFmdHQH3UoOpvqh5lw4dDFUqk9gMEw-c0",
    authDomain: "numerolog-v1.firebaseapp.com",
    projectId: "numerolog-v1",
    storageBucket: "numerolog-v1.firebasestorage.app",
    messagingSenderId: "972681774351",
    appId: "1:972681774351:web:dee631d7621e4acbd2aa7a",
    measurementId: "G-RSF2BNDZ4J"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);