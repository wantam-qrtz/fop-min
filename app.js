document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const loginForm = document.getElementById('login');
    const signupForm = document.getElementById('signup');
    const loginError = document.getElementById('login-error');
    const signupError = document.getElementById('signup-error');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const loginFormContainer = document.getElementById('login-form');
    const signupFormContainer = document.getElementById('signup-form');
    const welcomeScreen = document.getElementById('welcome-screen');
    const userEmailSpan = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logout-btn');

    // Switch between login and signup forms
    showSignup.addEventListener('click', function(e) {
        e.preventDefault();
        loginFormContainer.style.display = 'none';
        signupFormContainer.style.display = 'block';
        loginError.textContent = '';
    });

    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        signupFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';
        signupError.textContent = '';
    });

    // Login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Success
                showWelcomeScreen(userCredential.user.email);
                loginError.textContent = '';
            })
            .catch((error) => {
                loginError.textContent = error.message;
            });
    });

    // Signup
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Success
                showWelcomeScreen(userCredential.user.email);
                signupError.textContent = '';
            })
            .catch((error) => {
                signupError.textContent = error.message;
            });
    });

    // Logout
    logoutBtn.addEventListener('click', function() {
        auth.signOut().then(() => {
            welcomeScreen.style.display = 'none';
            loginFormContainer.style.display = 'block';
            loginForm.reset();
            signupForm.reset();
        });
    });

    // Show welcome screen
    function showWelcomeScreen(email) {
        userEmailSpan.textContent = email;
        loginFormContainer.style.display = 'none';
        signupFormContainer.style.display = 'none';
        welcomeScreen.style.display = 'block';
    }

    // Check auth state
    auth.onAuthStateChanged((user) => {
        if (user) {
            showWelcomeScreen(user.email);
        } else {
            welcomeScreen.style.display = 'none';
            loginFormContainer.style.display = 'block';
        }
    });
});
