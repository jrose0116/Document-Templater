import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
  
const firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
};

const app: firebase.app.App;

const auth: firebase.auth.Auth;
const firestore: firebase.firestore.Firestore;

export { app, auth, firestore, firebaseConfig }; 