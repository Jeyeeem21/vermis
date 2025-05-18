import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
   apiKey: "AIzaSyB5i_GS2Lg8dGx8Y5ris4FvfwvNz4HJucU",
    authDomain: "vue3-b0153.firebaseapp.com",
    projectId: "vue3-b0153",
    storageBucket: "vue3-b0153.firebasestorage.app",
    messagingSenderId: "315135589175",
    appId: "1:315135589175:web:1b704dd22c4b9b8bfe38b2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };