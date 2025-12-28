import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Replace with your Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyCxyZ9XH67BFA6U5TPXQr5H2EuckN7WjaQ",
    authDomain: "my-blog-b12b8.firebaseapp.com",
    projectId: "my-blog-b12b8",
    storageBucket: "my-blog-b12b8.firebasestorage.app",
    messagingSenderId: "684288978440",
    appId: "1:684288978440:web:9885a934b3dcf7a4ae6bbd",
    measurementId: "G-LZB8G8LC03"
};

// Initialize Firebase

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Explicitly requesting the default database
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

console.log('Firebase App Initialized:', app.name);
console.log('Target Project:', app.options.projectId);

export { db, auth, storage };
