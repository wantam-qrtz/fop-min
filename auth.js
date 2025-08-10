// Initialize Firebase with your config
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

// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const signUpBtn = document.getElementById('sign-up-btn');
const signInBtn = document.getElementById('sign-in-btn');
const signUpBtn2 = document.getElementById('sign-up-btn2');
const signInBtn2 = document.getElementById('sign-in-btn2');
const container = document.querySelector('.container');

// Switch between sign in and sign up
signUpBtn.addEventListener('click', () => {
    container.classList.add('sign-up-mode');
});

signInBtn.addEventListener('click', () => {
    container.classList.remove('sign-up-mode');
});

signUpBtn2.addEventListener('click', () => {
    container.classList.add('sign-up-mode');
});

signInBtn2.addEventListener('click', () => {
    container.classList.remove('sign-up-mode');
});

// Sign up
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = signupForm['signupEmail'].value;
    const password = signupForm['signupPassword'].value;
    const name = signupForm['signupName'].value;
    
    // Clear previous errors
    clearErrors();
    
    // Validate password length
    if (password.length < 6) {
        showError(signupForm, 'Password must be at least 6 characters');
        return;
    }
    
    // Create user
    auth.createUserWithEmailAndPassword(email, password)
        .then(cred => {
            // Add user to Firestore
            return db.collection('users').doc(cred.user.uid).set({
                name: name,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        })
        .catch(err => {
            showError(signupForm, err.message);
        });
});

// Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = loginForm['loginEmail'].value;
    const password = loginForm['loginPassword'].value;
    
    // Clear previous errors
    clearErrors();
    
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        })
        .catch(err => {
            showError(loginForm, err.message);
        });
});

// Google login (optional)
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.preventDefault();
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then(() => {
                window.location.href = 'dashboard.html';
            })
            .catch(err => {
                alert(err.message);
            });
    });
});

// Check auth state
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        console.log('User logged in:', user);
    } else {
        // User is signed out
        console.log('User logged out');
    }
});

// Helper functions
function showError(form, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error';
    errorElement.textContent = message;
    form.appendChild(errorElement);
}

function clearErrors() {
    document.querySelectorAll('.error').forEach(error => {
        error.remove();
    });
}