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
                student_id: studentId,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login Successful!");

            // Save token
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user_id', studentId);

            // Update UI (replicating logic from index.html)
            // Accessing global variables from index.html if possible, or manipulating DOM directly
            if (typeof updateUserInfo === 'function') {
                updateUserInfo(studentId);
            } else {
                // Fallback direct DOM manipulation
                document.getElementById('user-name').innerText = studentId;
                document.getElementById('user-avatar').innerText = studentId.substring(0, 2).toUpperCase();
                document.getElementById('user-plan').innerText = "Student User";
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
}
