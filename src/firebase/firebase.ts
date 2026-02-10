// src/firebase/firebase.ts
// Central Firebase setup (Auth + Firestore)
// We keep all firebase initialization in one place so the rest of the app imports from here

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase config pulled from Vite environment variables.
// Vite exposes env variables via import.meta.env
// IMPORTANT: env keys must start with VITE_
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Create the Firebase "app" instance 
const app = initializeApp(firebaseConfig)

// Firebase Auth instance (handles login/logout/current user)
export const auth = getAuth(app)

// Firestore DB instance (your document database)
export const db = getFirestore(app)

// Firebase Storage instance (for product images, etc.)
export const storage = getStorage(app)