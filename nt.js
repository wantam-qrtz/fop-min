// Firebase configuration - replace with your own
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_GDGvmF2laCAnBa30IfgGM33ldLgkyvw",
  authDomain: "notebook-22e04.firebaseapp.com",
  projectId: "notebook-22e04",
  storageBucket: "notebook-22e04.firebasestorage.app",
  messagingSenderId: "442718941076",
  appId: "1:442718941076:web:ff1b8346aee4bb3df42981",
  measurementId: "G-656TVE5F6R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase
const db = getFirestore(app);
const auth = getAuth(app);

// List of admin emails (replace with your 3 admin emails)
const ADMIN_EMAILS = [
    "douglasburare3@gmail.com",
    "douglasburare1@gmail.com",
    "douglasburare@gmail.com"
];

// DOM elements
const notebook = document.getElementById('notebook');
const announcementPanel = document.getElementById('announcementPanel');
const announcementList = document.getElementById('announcementList');
const unreadBadge = document.getElementById('unreadBadge');
const adminControls = document.getElementById('adminControls');
const addAnnouncementBtn = document.getElementById('addAnnouncementBtn');
const announcementModal = document.getElementById('announcementModal');
const closeModal = document.querySelector('.close');
const saveAnnouncementBtn = document.getElementById('saveAnnouncementBtn');
const announcementText = document.getElementById('announcementText');

// Track read announcements
let readAnnouncements = JSON.parse(localStorage.getItem('readAnnouncements')) || [];
let currentUser = null;

// Check authentication state
auth.onAuthStateChanged(user => {
    currentUser = user;
    if (user && ADMIN_EMAILS.includes(user.email)) {
        adminControls.style.display = 'block';
    } else {
        adminControls.style.display = 'none';
    }
    loadAnnouncements();
});
//login functionality
function login() {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(() => {
                    window.location.href = "index.html"; // Go to main page
                })
                .catch(error => {
                    document.getElementById('error').innerText = error.message;
                });
        }

// Load announcements from Firestore
function loadAnnouncements() {
    db.collection("announcements").orderBy("timestamp", "desc").onSnapshot(snapshot => {
        announcementList.innerHTML = '';
        let unreadCount = 0;
        
        snapshot.forEach(doc => {
            const announcement = doc.data();
            const isRead = readAnnouncements.includes(doc.id);
            
            if (!isRead) {
                unreadCount++;
            }
            
            const announcementItem = document.createElement('div');
            announcementItem.className = `announcement-item ${isRead ? '' : 'unread'}`;
            announcementItem.innerHTML = `
                <p>${announcement.text}</p>
                <div class="announcement-date">
                    ${new Date(announcement.timestamp.toDate()).toLocaleString()}
                    ${currentUser && ADMIN_EMAILS.includes(currentUser.email) ? 
                      `<button class="delete-btn" data-id="${doc.id}">Delete</button>` : ''}
                </div>
            `;
            
            announcementItem.addEventListener('click', () => {
                if (!isRead) {
                    readAnnouncements.push(doc.id);
                    localStorage.setItem('readAnnouncements', JSON.stringify(readAnnouncements));
                    announcementItem.classList.remove('unread');
                    unreadBadge.textContent = parseInt(unreadBadge.textContent) - 1;
                }
            });
            
            announcementList.appendChild(announcementItem);
        });
        
        // Update unread badge
        unreadBadge.textContent = unreadCount;
        unreadBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this announcement?')) {
                    db.collection("announcements").doc(btn.dataset.id).delete();
                }
            });
        });
    });
}

// Modal controls
addAnnouncementBtn.addEventListener('click', () => {
    announcementModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    announcementModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === announcementModal) {
        announcementModal.style.display = 'none';
    }
});

saveAnnouncementBtn.addEventListener('click', () => {
    const text = announcementText.value.trim();
    if (text) {
        db.collection("announcements").add({
            text: text,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            announcementText.value = '';
            announcementModal.style.display = 'none';
        });
    } else {
        alert('Please enter an announcement text');
    }
});

// Prevent panel from closing when clicking inside it
announcementPanel.addEventListener('click', (e) => {
    e.stopPropagation();

});
