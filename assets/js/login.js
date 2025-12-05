/* assets/js/login.js - Cleaned Version */

console.log("Systemize Login Script Loaded ✅"); // رسالة للتأكد من تحميل الملف

const VALID_USER = "shady"; 
const VALID_PASS = "123";   
const MAX_ATTEMPTS = 5;     
let attempts = 0;    
let isLocked = false; 
let isRemembered = false;

// تعريف العناصر
const mainContainer = document.getElementById('mainContainer');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMsg = document.getElementById('loginError');
const messageOverlay = document.getElementById('messageOverlay');
const messageContent = document.getElementById('messageContent');
const footer = document.getElementById('mainFooter');
const rememberBtn = document.getElementById('rememberBtn');
// لاحظ: زر الدخول لم يكن له ID في الـ HTML، سنعتمد على onclick الموجودة في الـ HTML
// ولكن يفضل التأكد من أن الدالة متاحة للنظام (Global Scope)

/* =========================
   Logic Functions
   ========================= */

function cleanInputs() {
    if(usernameInput) usernameInput.value = '';
    if(passwordInput) passwordInput.value = '';
    if(errorMsg) errorMsg.style.opacity = '0'; 
    if(usernameInput) usernameInput.focus(); 
}

function switchView(viewId) {
    const currentView = document.querySelector('.view-section.active');
    const nextView = document.getElementById(viewId);
    
    if (currentView) {
        currentView.classList.remove('active'); 
        currentView.classList.add('fading-out');
        if(errorMsg) errorMsg.style.opacity = '0'; 
        
        setTimeout(() => {
            currentView.classList.remove('fading-out');
            currentView.style.display = 'none';
            
            if (nextView) {
                nextView.style.display = 'block';
                requestAnimationFrame(() => {
                    nextView.classList.add('active');
                });
            }
        }, 500); 
    } else {
        if (nextView) {
            nextView.style.display = 'block';
            setTimeout(() => nextView.classList.add('active'), 10);
        }
    }
}

// جعل الدالة متاحة للنافذة (Window) لضمان أن زر الـ HTML يراها
window.handleLogin = function() {
    console.log("Login Button Clicked 🖱️"); // للتجربة
    
    if (isLocked) return; 

    if (!usernameInput || !passwordInput) {
        console.error("Input fields not found!");
        return;
    }

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
};

function runEmptyInputSequence() {
    if(mainContainer) mainContainer.style.opacity = '0';
    if(footer) footer.style.opacity = '0';

    setTimeout(() => {
        if(messageOverlay) messageOverlay.style.display = 'flex';
        updateMessageText("Please make sure you have entered the correct username and password");
        setTimeout(() => {
            if(messageContent) messageContent.classList.remove('visible'); 
            setTimeout(() => {
                updateMessageText("Please connect with our Systemiz Team if you still facing problem");
                setTimeout(() => {
                    if(messageContent) messageContent.classList.remove('visible');
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
    console.log("Login Failed. Attempts:", attempts);
    
    if(mainContainer) {
        mainContainer.classList.remove('shake-anim');
        void mainContainer.offsetWidth; // Trigger Reflow
        mainContainer.classList.add('shake-anim');
    }
    
    if(errorMsg) errorMsg.style.opacity = '1';
    if(passwordInput) {
        passwordInput.value = ''; 
        passwordInput.focus();
    }

    if (attempts >= MAX_ATTEMPTS) {
        runLockoutSequence();
    }
}

function runLockoutSequence() {
    isLocked = true;
    attempts = 0;
    if(mainContainer) mainContainer.style.opacity = '0';
    if(footer) footer.style.opacity = '0';
    
    setTimeout(() => {
        if(messageOverlay) messageOverlay.style.display = 'flex';
        updateMessageText("Account temporarily locked for security.");
        setTimeout(() => {
            if(messageContent) messageContent.classList.remove('visible'); 
            setTimeout(() => {
                updateMessageText("Please contact support for assistance.");
                setTimeout(() => {
                    if(messageContent) messageContent.classList.remove('visible');
                    setTimeout(() => {
                        resetToLogin();
                    }, 1500); 
                }, 4000); 
            }, 1500); 
        }, 4000); 
    }, 1000);
}

function runSuccessSequence(name) {
    console.log("Login Success! Redirecting...");
    if(mainContainer) mainContainer.style.opacity = '0';
    if(footer) footer.style.opacity = '0';
    
    setTimeout(() => {
        if(mainContainer) mainContainer.style.display = 'none';
        if(messageOverlay) messageOverlay.style.display = 'flex';
        updateMessageText(`Welcome ${name}`);
        
        setTimeout(() => {
            if(messageContent) messageContent.classList.remove('visible'); 
            setTimeout(() => {
                updateMessageText('Always be prepared for a great day');
                setTimeout(() => {
                    if(messageContent) messageContent.classList.remove('visible'); 
                    // الانتقال للداشبورد
                    console.log("Going to index.html now...");
                    window.location.href = 'index.html';
                }, 3000);
            }, 1500);
        }, 3000);
    }, 1000);
}

function updateMessageText(text) {
    if(messageContent) {
        messageContent.innerHTML = text;
        setTimeout(() => {
            messageContent.classList.add('visible');
        }, 50);
    }
}

function resetToLogin() {
    if(messageOverlay) messageOverlay.style.display = 'none';
    if(messageContent) messageContent.classList.remove('visible');
    if(mainContainer) mainContainer.style.opacity = '1';
    if(footer) footer.style.opacity = '1';
    
    document.querySelectorAll('.view-section').forEach(el => {
        el.classList.remove('active', 'fading-out');
        el.style.display = 'none';
    });
    
    const loginView = document.getElementById('loginView');
    if(loginView) {
        loginView.style.display = 'block';
        setTimeout(() => loginView.classList.add('active'), 50);
    }
    isLocked = false;
}

/* =========================
   Event Listeners
   ========================= */

if (rememberBtn) {
    rememberBtn.addEventListener('click', function() {
        this.classList.toggle('checked');
        isRemembered = !isRemembered;
    });
}

if (passwordInput) {
    passwordInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') window.handleLogin();
    });
}

// تعريف دوال التنظيف والتبديل للنافذة أيضاً
window.cleanInputs = cleanInputs;
window.switchView = switchView;