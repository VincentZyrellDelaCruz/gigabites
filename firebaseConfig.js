// import {...} from 'firebase/firestore'; 
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// CONFIGURATION FILE FOR FIREBASE JS SDK
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCg6PFY6axMErYtiB4BjJvEPMADWuXhM68",
  authDomain: "gigabites-e0d5e.firebaseapp.com",
  databaseURL: "https://gigabites-e0d5e-default-rtdb.firebaseio.com",
  projectId: "gigabites-e0d5e",
  storageBucket: "gigabites-e0d5e.firebasestorage.app",
  messagingSenderId: "856305171660",
  appId: "1:856305171660:web:78d074e062ad3569081669",
  measurementId: "G-4JDN38WN36",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const database = getDatabase(app);

export { auth, database };
