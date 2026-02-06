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
        const response = await fetch('http://127.0.0.1:8000/auth/login', {
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

            // Display completed courses in chat if available
            if (data.user_data && data.user_data.completed_courses) {
                const courses = data.user_data.completed_courses;
                if (courses.length > 0) {
                    let courseMsg = `Welcome, ${data.user_data.name}! Here are your completed courses:\n`;
                    courses.forEach(c => {
                        courseMsg += `- ${c.course_name} (${c.course_code}): ${c.score || 'N/A'}\n`;
                    });

                    // Assuming appendMessage is available in the global scope (from index.html)
                    if (typeof appendMessage === 'function') {
                        appendMessage('bot', courseMsg);
                    } else {
                        console.log("Completed Courses:", courseMsg);
                    }
                }
            }

            navigateAfterLogin();

            // Load chat history from backend after login
            if (typeof loadChatHistoryFromBackend === 'function') {
                loadChatHistoryFromBackend();
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
    if (typeof currentUserId !== 'undefined') {
        window.currentUserId = "guest";
    } else {
        window.currentUserId = "guest";
    }

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

    // Clear token
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');

    // Clear chat history UI
    if (typeof checkAndUpdateHistoryUI === 'function') {
        checkAndUpdateHistoryUI();
    }
}

// Initialize session on page load
async function initSession() {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
        const response = await fetch('http://127.0.0.1:8000/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
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

                console.log("Session restored for:", user.name);

                // Load chat history from backend
                if (typeof loadChatHistoryFromBackend === 'function') {
                    loadChatHistoryFromBackend();
                }
            }
        } else {
            // Token might be expired
            handleLogout();
        }
    } catch (error) {
        console.error('Session init error:', error);
    }
}

// Run on load
document.addEventListener('DOMContentLoaded', initSession);

