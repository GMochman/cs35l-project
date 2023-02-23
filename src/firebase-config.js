// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDq7oR0HdQH8D7YomYeyFBGC1WrE6n5QYg",
  authDomain: "foodies-fe766.firebaseapp.com",
  projectId: "foodies-fe766",
  storageBucket: "foodies-fe766.appspot.com",
  messagingSenderId: "908759239753",
  appId: "1:908759239753:web:13c30ef790c1440fb8c398",
  measurementId: "G-BRK089D5GX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();