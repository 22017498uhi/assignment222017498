// Import the functions 
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBt_ZHsTufymAKYgPja2oZCJrTXb1M1xHQ",
  authDomain: "assignment222017498.firebaseapp.com",
  databaseURL: "https://assignment222017498-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "assignment222017498",
  storageBucket: "assignment222017498.appspot.com",
  messagingSenderId: "9190830951",
  appId: "1:9190830951:web:53a67e67c3412efbf935c2",
  measurementId: "G-LQNP79PEQH"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth();
const analytics = getAnalytics(app);
const storage = getStorage(app);
const db = getDatabase(app);


export { app, firestore, auth, analytics, storage, db };