async function handleLogin(event) {
    if (event) event.preventDefault();

    const studentIdInput = document.getElementById('student-id');
    const passwordInput = document.getElementById('password');

    const studentId = studentIdInput.value.trim();
    const password = passwordInput.value.trim();

    if (!studentId || !password) {
        alert("Please enter both Student ID and Password.");
        return;
    }

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: studentId,
                user_password: password
            })

        });

        const data = await response.json();

        if (response.ok) {
            alert("Login Successful!");

            // Save token
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user_id', studentId);

            // Update UI (replicating logic from index.html)
            if (typeof updateUserInfo === 'function') {
                updateUserInfo(studentId);
            } else if (data.user_data) {
                // Directly update DOM using returned profile data
                const user = data.user_data;
                document.getElementById('user-name').innerText = user.name || studentId;

                // Set initials from name (e.g., "GS" from "Guest Student")
                const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : studentId.substring(0, 2).toUpperCase();
                document.getElementById('user-avatar').innerText = initials;

                document.getElementById('user-plan').innerText = user.major || "Student User";
                document.getElementById('auth-text').innerText = "Logout";
                document.getElementById('auth-icon').innerText = "logout";

                const authBtn = document.getElementById('auth-btn');
                if (authBtn) {
                    authBtn.onclick = handleLogout;
                }
            }


            // Update global currentUserId if accessible
            if (typeof currentUserId !== 'undefined') {
                currentUserId = studentId;
            } else {
                window.currentUserId = studentId;
            }

            navigateAfterLogin();

            // Load chat history from backend after login
            if (typeof loadChatHistoryFromBackend === 'function') {
                loadChatHistoryFromBackend();
            }

            // Load grade records from backend after login
            if (typeof loadGradeRecordsFromBackend === 'function') {
                loadGradeRecordsFromBackend();
            }

            // Update chat input state
            if (typeof updateChatInputState === 'function') {
                updateChatInputState(true);
            }

        } else {
            alert("Login Failed: " + (data.detail || "Check credentials"));
        }
    } catch (error) {
        console.error('Login error:', error);
        alert("An error occurred during login.");
    }
}

function navigateAfterLogin() {
    if (typeof toggleLoginModal === 'function') {
        toggleLoginModal();
    }
}

function handleLogout() {
    // 1. UI elements cleanup
    document.getElementById('user-name').innerText = "Guest Student";
    document.getElementById('user-avatar').innerText = "GS";
    document.getElementById('user-plan').innerText = "Newcomer";
    document.getElementById('auth-text').innerText = "Login";
    document.getElementById('auth-icon').innerText = "login";

    const authBtn = document.getElementById('auth-btn');
    if (authBtn) {
        authBtn.onclick = () => {
            if (typeof toggleLoginModal === 'function') toggleLoginModal();
        };
    }

    // 2. Global state and session cleanup
    if (typeof currentUserId !== 'undefined') {
        window.currentUserId = "guest";
    } else {
        window.currentUserId = "guest";
    }

    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');

    // 3. UI Modules updates
    // Close grade modal BEFORE anything else
    const gradeModal = document.getElementById('grade-modal');
    if (gradeModal && !gradeModal.classList.contains('translate-y-full')) {
        gradeModal.classList.add('translate-y-full');
    }

    if (typeof checkAndUpdateHistoryUI === 'function') {
        checkAndUpdateHistoryUI();
    }

    if (typeof startNewChat === 'function') {
        startNewChat({ suppressGuestConfirm: true, clearGuestHistory: true });
    }

    if (typeof updateChatInputState === 'function') {
        updateChatInputState(false);
    }
}

// Initialize session on page load
async function initSession() {
    const token = localStorage.getItem('access_token');
    if (!token) {
        if (typeof updateChatInputState === 'function') {
            updateChatInputState(false);
        }
        return;
    }

    try {
        const response = await fetch('/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            // ... (keep existing logic)
            const data = await response.json();
            const studentId = localStorage.getItem('user_id');

            // Update UI
            if (data.user_data) {
                const user = data.user_data;
                document.getElementById('user-name').innerText = user.name || studentId;

                const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : studentId.substring(0, 2).toUpperCase();
                document.getElementById('user-avatar').innerText = initials;

                document.getElementById('user-plan').innerText = user.major || "Student User";
                document.getElementById('auth-text').innerText = "Logout";
                document.getElementById('auth-icon').innerText = "logout";

                const authBtn = document.getElementById('auth-btn');
                if (authBtn) {
                    authBtn.onclick = handleLogout;
                }

                if (typeof currentUserId !== 'undefined') {
                    window.currentUserId = studentId;
                } else {
                    window.currentUserId = studentId;
                }

                // Load chat history from backend
                if (typeof loadChatHistoryFromBackend === 'function') {
                    loadChatHistoryFromBackend();
                }

                // Load grade records from backend
                if (typeof loadGradeRecordsFromBackend === 'function') {
                    loadGradeRecordsFromBackend();
                }

                // Update chat input state
                if (typeof updateChatInputState === 'function') {
                    updateChatInputState(true);
                }
            }
        } else {
            // Token might be expired
            handleLogout();
        }
    } catch (error) {
        console.error('Session init error:', error);
        // Ensure guest chat is still enabled on network error if configured
        if (typeof updateChatInputState === 'function') {
            updateChatInputState(false);
        }
    }
}

// Run on load
document.addEventListener('DOMContentLoaded', initSession);

async function handleFindPassword(event) {
    if (event) event.preventDefault();

    const studentIdInput = document.getElementById('find-student-id');
    const emailInput = document.getElementById('find-email');
    const resultDiv = document.getElementById('find-password-result-container');
    const passwordSpan = document.getElementById('recovered-password-display');

    const studentId = studentIdInput.value.trim();
    const email = emailInput.value.trim();

    if (!studentId || !email) {
        alert("Please enter both Student ID and Email.");
        return;
    }

    try {
        const response = await fetch('/auth/find-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: studentId,
                email: email
            })
        });

        const data = await response.json();

        if (response.ok) {
            if (typeof openPasswordSuccessModal === 'function') {
                openPasswordSuccessModal(data.password);
            } else {
                passwordSpan.innerText = data.password;
                resultDiv.classList.remove('hidden');
            }
        } else {
            alert("No account found with the provided information.\nIf you cannot find your password, please contact the faculty office.");
            resultDiv.classList.add('hidden');
        }
    } catch (error) {
        console.error('Find password error:', error);
        alert("An error occurred. Please try again later.");
    }
}

