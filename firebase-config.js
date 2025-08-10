// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvzJKKnrby8kmsV6csVEXT3abCMZ3Riow",
  authDomain: "sign-ffff3.firebaseapp.com",
  projectId: "sign-ffff3",
  storageBucket: "sign-ffff3.firebasestorage.app",
  messagingSenderId: "461869144298",
  appId: "1:461869144298:web:ba27f8716285ef197bdf93",
  measurementId: "G-F87KDLQM4F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
