// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFunctions, } from "firebase/functions";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyBoSjlFd2xu_BNEjHGBwXAS0XuKpOdmI_8",
    authDomain: "labms-1cd27.firebaseapp.com",
    projectId: "labms-1cd27",
    storageBucket: "labms-1cd27.firebasestorage.app",
    messagingSenderId: "283333508310",
    appId: "1:283333508310:web:9fb84b7e21abbe4e8b5d77",
    measurementId: "G-J5NL79X18N"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const auth = getAuth();
// if (window.location.hostname === "localhost") {
//   connectFirestoreEmulator(db, "localhost", 8080);
//   connectAuthEmulator(auth, "http://localhost:9099");
// }

const functions = getFunctions(app);

// // Connect to Emulator for local testing
// if (window.location.hostname === "localhost") {
//   connectFunctionsEmulator(functions, "localhost", 5001);
// }


export { auth, functions };
