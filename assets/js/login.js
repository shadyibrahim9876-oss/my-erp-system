/* assets/js/login.js - Final Fix */

const VALID_USER = "shady"; 
const VALID_PASS = "123";   
const MAX_ATTEMPTS = 5;     
let attempts = 0;    
let isLocked = false; 
let isRemembered = false;

// Elements
const mainContainer = document.getElementById('mainContainer');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMsg = document.getElementById('loginError');
const messageOverlay = document.getElementById('messageOverlay');
const messageContent = document.getElementById('messageContent');
const footer = document.getElementById('mainFooter');
const rememberBtn = document.getElementById('rememberBtn');
const loginBtn = document.getElementById('loginSubmitBtn'); // الزر الجديد

// 1. Event Listener for Login Button (The Fix)
if (loginBtn) {
    loginBtn.addEventListener('click', handleLogin);
}

// 2. Event Listener for Enter Key
if (passwordInput) {
    passwordInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') handleLogin();
    });
}

// 3. Event Listener for Remember Me
if (rememberBtn) {
    rememberBtn.addEventListener('click', function() {
        this.classList.toggle('checked');
        isRemembered = !isRemembered;
    });
}

// --- Functions ---

function handleLogin() {
    if (isLocked) return; 
    
    const user = usernameInput.value.trim();
    const pass = passwordInput.value;

    if (user === '' || pass === '') {
        runEmptyInputSequence();
        return;
    }

    if (user === VALID_USER && pass === VALID_PASS) {
        runSuccessSequence(user);
    } else {
        handleFailure();
    }
}

function cleanInputs() {
    usernameInput.value = '';
    passwordInput.value = '';
    errorMsg.style.opacity = '0'; 
    usernameInput.focus(); 
}

function switchView(viewId) {
    const currentView = document.querySelector('.view-section.active');
    const nextView = document.getElementById(viewId);
    if (currentView) {
        currentView.classList.remove('active'); 
        currentView.classList.add('fading-out');
        errorMsg.style.opacity = '0'; 
        setTimeout(() => {
            currentView.classList.remove('fading-out');
            currentView.style.display = 'none';
            nextView.style.display = 'block';
            requestAnimationFrame(() => {
                nextView.classList.add('active');
            });
        }, 500); 
    } else {
        nextView.style.display = 'block';
        setTimeout(() => nextView.classList.add('active'), 10);
    }
    // Make functions global just in case needed by HTML onlicks elsewhere
    window.switchView = switchView;
    window.cleanInputs = cleanInputs;
}
// Initialize global scope mapping immediately
window.switchView = switchView;
window.cleanInputs = cleanInputs;


function runEmptyInputSequence() {
    mainContainer.style.opacity = '0';
    footer.style.opacity = '0';
    setTimeout(() => {
        messageOverlay.style.display = 'flex';
        updateMessageText("Please make sure you have entered the correct username and password");
        setTimeout(() => {
            messageContent.classList.remove('visible'); 
            setTimeout(() => {
                updateMessageText("Please connect with our Systemiz Team if you still facing problem");
                setTimeout(() => {
                    messageContent.classList.remove('visible');
                    setTimeout(() => {
                        resetToLogin();
                    }, 1500); 
                }, 4000); 
            }, 1500); 
        }, 4000); 
    }, 500);
}

function handleFailure() {
    attempts++;
    mainContainer.classList.remove('shake-anim');
    void mainContainer.offsetWidth; 
    mainContainer.classList.add('shake-anim');
    errorMsg.style.opacity = '1';
    passwordInput.value = ''; 
    passwordInput.focus();
    if (attempts >= MAX_ATTEMPTS) {
        runLockoutSequence();
    }
}

function runLockoutSequence() {
    isLocked = true;
    attempts = 0;
    mainContainer.style.opacity = '0';
    footer.style.opacity = '0';
    setTimeout(() => {
        messageOverlay.style.display = 'flex';
        updateMessageText("Account temporarily locked for security.");
        setTimeout(() => {
            messageContent.classList.remove('visible'); 
            setTimeout(() => {
                updateMessageText("Please contact support for assistance.");
                setTimeout(() => {
                    messageContent.classList.remove('visible');
                    setTimeout(() => {
                        resetToLogin();
                    }, 1500); 
                }, 4000); 
            }, 1500); 
        }, 4000); 
    }, 1000);
}

function runSuccessSequence(name) {
    mainContainer.style.opacity = '0';
    footer.style.opacity = '0';
    setTimeout(() => {
        mainContainer.style.display = 'none';
        messageOverlay.style.display = 'flex';
        updateMessageText(`Welcome ${name}`);
        setTimeout(() => {
            messageContent.classList.remove('visible'); 
            setTimeout(() => {
                updateMessageText('Always be prepared for a great day');
                setTimeout(() => {
                    messageContent.classList.remove('visible'); 
                    // الانتقال للداشبورد
                    window.location.href = 'index.html';
                }, 3000);
            }, 1500);
        }, 3000);
    }, 1000);
}

function updateMessageText(text) {
    messageContent.innerHTML = text;
    setTimeout(() => {
        messageContent.classList.add('visible');
    }, 50);
}

function resetToLogin() {
    messageOverlay.style.display = 'none';
    messageContent.classList.remove('visible');
    mainContainer.style.opacity = '1';
    footer.style.opacity = '1';
    document.querySelectorAll('.view-section').forEach(el => {
        el.classList.remove('active', 'fading-out');
        el.style.display = 'none';
    });
    const loginView = document.getElementById('loginView');
    loginView.style.display = 'block';
    setTimeout(() => loginView.classList.add('active'), 50);
    isLocked = false;
}
