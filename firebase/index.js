// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARwbN_nMMYMqn7Hko2Xv8D_0zLr-fIWho",
  authDomain: "sanhak-45ec5.firebaseapp.com",
  projectId: "sanhak-45ec5",
  storageBucket: "sanhak-45ec5.appspot.com",
  messagingSenderId: "637160669980",
  appId: "1:637160669980:web:bea50186c2fbb6dbd5b0d9",
  measurementId: "G-RDRPF862Z9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export {app, db, analytics, getFirestore, collection, addDoc, getDocs};