// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { getFunctions } from "firebase/functions";


      

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdGCeQn7ho4UP1IjFudfZkvBePVlja01g",
  authDomain: "tagrosclips.firebaseapp.com",
  databaseURL: "https://tagrosclips-default-rtdb.firebaseio.com",
  projectId: "tagrosclips",
  storageBucket: "tagrosclips.appspot.com",
  messagingSenderId: "172138021945",
  appId: "1:172138021945:web:6f3c2e2004a597823839e8",
  measurementId: "G-JV6FQ0G8NF"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Creating our functions:
//import { getFunctions } from "firebase/functions";
// Creating an instance of our functions from our app 



/**
 * Signs the user in with a Google popup.
 * @returns A promise that resolves with the user's credentials.
 */
export function signInWithGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

/**
 * Signs the user out.
 * @returns A promise that resolves when the user is signed out.
 */
export function signOut() {
  return auth.signOut();
}

/**
 * Trigger a callback when user auth state changes.
 * @returns A function to unsubscribe callback.
 */
export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}


export const functions = getFunctions(app);