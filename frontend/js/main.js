const chatContainer = document.getElementById('chat-container');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const loginModal = document.getElementById('login-modal');
const gradeModal = document.getElementById('grade-modal');
const historyList = document.getElementById('history-list');
let isGpaEditMode = false;
let currentSemester = "Y1S1";

// Structure for 5 years, 3 semesters each
const semesters = [
    { id: 'Y1S1', label: '1-1' }, { id: 'Y1S2', label: '1-2' }, { id: 'Y1S3', label: '1-3' },
    { id: 'Y2S1', label: '2-1' }, { id: 'Y2S2', label: '2-2' }, { id: 'Y2S3', label: '2-3' },
    { id: 'Y3S1', label: '3-1' }, { id: 'Y3S2', label: '3-2' }, { id: 'Y3S3', label: '3-3' },
    { id: 'Y4S1', label: '4-1' }, { id: 'Y4S2', label: '4-2' }, { id: 'Y4S3', label: '4-3' },
    { id: 'Y5S1', label: '5-1' }, { id: 'Y5S2', label: '5-2' }, { id: 'Y5S3', label: '5-3' }
];

// Initialize semesterData from localStorage or defaults
let semesterData = JSON.parse(localStorage.getItem('semesterData')) || {};
semesters.forEach(s => {
    // Check if it's the old default data (1 row, default name) and clear it
    if (semesterData[s.id] && semesterData[s.id].length === 1 && semesterData[s.id][0].name === 'Course Name') {
        semesterData[s.id] = [];
    }
    if (!semesterData[s.id]) {
        semesterData[s.id] = [];
    }
});

function initSemesterTabs() {
    const container = document.getElementById('semester-tabs');
    container.innerHTML = semesters.map(s => `
        <button onclick="switchSemester('${s.id}')" id="tab-${s.id}" 
            class="semester-tab ${currentSemester === s.id ? 'is-active' : ''}">
            ${s.label}
        </button>
    `).join('');
}

function showCustomModal(options) {
    const modal = document.getElementById('custom-modal');
    const title = document.getElementById('modal-title');
    const message = document.getElementById('modal-message');
    const icon = document.getElementById('modal-icon');
    const primaryBtn = document.getElementById('modal-primary-btn');
    const secondaryBtn = document.getElementById('modal-secondary-btn');
    const closeBtn = document.getElementById('modal-close-btn');

    title.innerText = options.title || "Notice";
    message.innerText = options.message || "";
    icon.innerText = options.icon || "info";
    primaryBtn.innerText = options.primaryText || "Confirm";

    if (options.showSecondary) {
        secondaryBtn.classList.remove('is-hidden');
        secondaryBtn.innerText = options.secondaryText || "Cancel";
    } else {
        secondaryBtn.classList.add('is-hidden');
    }

    modal.classList.remove('is-hidden');

    return new Promise((resolve) => {
        const handlePrimary = () => {
            modal.classList.add('is-hidden');
            primaryBtn.removeEventListener('click', handlePrimary);
            secondaryBtn.removeEventListener('click', handleSecondary);
            closeBtn.removeEventListener('click', handleClose);
            resolve(true);
        };
        const handleSecondary = () => {
            modal.classList.add('is-hidden');
            primaryBtn.removeEventListener('click', handlePrimary);
            secondaryBtn.removeEventListener('click', handleSecondary);
            closeBtn.removeEventListener('click', handleClose);
            resolve(false);
        };
        const handleClose = () => {
            modal.classList.add('is-hidden');
            primaryBtn.removeEventListener('click', handlePrimary);
            secondaryBtn.removeEventListener('click', handleSecondary);
            closeBtn.removeEventListener('click', handleClose);
            resolve(false);
        };
        primaryBtn.addEventListener('click', handlePrimary);
        secondaryBtn.addEventListener('click', handleSecondary);
        closeBtn.addEventListener('click', handleClose);
    });
}

async function switchSemester(id) {
    if (isGpaEditMode) {
        const confirmed = await showCustomModal({
            title: "Unsaved Changes",
            message: "You have unsaved changes. Switching semesters will discard your current edits. Do you want to continue?",
            icon: "warning",
            primaryText: "Continue",
            showSecondary: true,
            secondaryText: "Go Back"
        });

        if (!confirmed) return;
        // If they continue, we revert edit mode to sync UI correctly
        toggleGpaEditMode();
    }
    currentSemester = id;
    initSemesterTabs();
    renderSemesterTable();
    // Scroll tab into view if needed
    document.getElementById(`tab-${id}`).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function renderSemesterTable() {
    const tbody = document.querySelector('#grade-modal tbody');
    tbody.innerHTML = '';

    const data = semesterData[currentSemester];

    if (data.length === 0) {
        if (!isGpaEditMode) {
            const tr = document.createElement('tr');
            tr.style.height = "100%"; // Ensure row tries to fill available height
            tr.innerHTML = `
                <td colspan="6" class="empty-row">
                    No courses added yet. Click <span class="highlight">'Edit Record'</span> to start.
                </td>
            `;
            tbody.appendChild(tr);
        }
    } else {
        data.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.className = "grade-row";
            tr.innerHTML = `
                <td class="cell-center">
                    <input type="checkbox" onchange="updateRowData(this, 'major')" class="major-checkbox" ${row.major ? 'checked' : ''} ${!isGpaEditMode ? 'disabled' : ''}>
                </td>
                <td class="cell">
                    <select onchange="updateRowData(this, 'credit')" class="credit-select" ${!isGpaEditMode ? 'disabled' : ''}>
                        <option value="2" ${row.credit == 2 ? 'selected' : ''}>2</option>
                        <option value="3" ${row.credit == 3 ? 'selected' : ''}>3</option>
                        <option value="4" ${row.credit == 4 ? 'selected' : ''}>4</option>
                    </select>
                </td>
                <td class="cell"><input onfocus="updateRowData(this, 'name')" oninput="updateRowData(this, 'name')" class="course-input" type="text" placeholder="Search Course..." value="${row.name}" ${!isGpaEditMode ? 'disabled' : ''} /></td>
                <td class="cell">
                    <input class="grade-point-input" value="${row.point}" readonly />
                </td>
                <td class="cell">
                    <select onchange="updateRowPoint(this)" class="grade-select" ${!isGpaEditMode ? 'disabled' : ''}>
                        ${Object.keys(gradeMapping).map(g => `<option value="${g}" ${row.grade === g || (row.grade === undefined && g === 'A') ? 'selected' : ''}>${g}</option>`).join('')}
                    </select>
                </td>
                <td class="cell-end">
                    <button onclick="deleteRow(this)" class="delete-row-btn ${!isGpaEditMode ? 'is-hidden' : ''}"><span class="material-symbols-outlined">delete</span></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Sync Add Row button position
    if (isGpaEditMode) {
        const addRowTr = document.createElement('tr');
        addRowTr.className = "grade-row";
        addRowTr.innerHTML = `
            <td colspan="6" class="cell-add">
                <button onclick="addRow()" class="btn-link">
                    <span class="material-symbols-outlined">add_circle</span>
                    Add New Course
                </button>
            </td>
        `;
        tbody.appendChild(addRowTr);
    }
    calculateGPA();
}

function updateRowData(element, field) {
    const tr = element.closest('tr');
    const index = Array.from(tr.parentNode.children).indexOf(tr);
    const val = field === 'major' ? element.checked : element.value;
    semesterData[currentSemester][index][field] = val;

    if (field === 'name') {
        // Course Autocomplete Logic
        // Trigger immediately, backend handles empty query now
        debouncedSearch(val, element);
    }

    if (field === 'major' || field === 'credit') {
        calculateGPA();
    }
}

async function toggleGradeModal() {
    if (window.currentUserId === "guest") {
        const proceedToLogin = await showCustomModal({
            title: "Login Required",
            message: "Please login with your student account to use the GPA Calculator.",
            icon: "lock",
            primaryText: "Go to Login"
        });

        if (proceedToLogin) {
            toggleLoginModal();
        }
        return;
    }
    gradeModal.classList.toggle('grade-modal--hidden');
    if (!gradeModal.classList.contains('grade-modal--hidden')) {
        initSemesterTabs();
        renderSemesterTable();
    }
}

const gradeMapping = {
    'A': '4.00', 'A-': '3.67', 'B+': '3.33', 'B': '3.00', 'B-': '2.67',
    'C+': '2.33', 'C': '2.00', 'C-': '1.67', 'D+': '1.00', 'D': '1.00',
    'D-': '1.00', 'F': '0.00', 'P': ''
};

function updateRowPoint(selectElement) {
    const tr = selectElement.closest('tr');
    const index = Array.from(tr.parentNode.children).indexOf(tr);
    const grade = selectElement.value;
    const pointValue = gradeMapping[grade] || '';

    semesterData[currentSemester][index].grade = grade;
    semesterData[currentSemester][index].point = pointValue;

    renderSemesterTable();
}

function calculateGPA() {
    let totalCredits = 0;
    let totalWeightedPoints = 0;
    let majorCredits = 0;
    let majorWeightedPoints = 0;

    let currentSemCredits = 0;
    let currentSemWeightedPoints = 0;
    let currentSemMajorCredits = 0;
    let currentSemMajorWeightedPoints = 0;

    // Iterate over all semesters to get cumulative totals
    semesters.forEach(s => {
        const data = semesterData[s.id];
        if (!data) return;

        data.forEach(row => {
            const creditValue = parseFloat(row.credit) || 0;
            const pointValue = parseFloat(row.point);
            const isMajor = row.major;
            const isPass = row.grade === 'P';

            if (!isNaN(pointValue)) {
                totalCredits += creditValue;
                totalWeightedPoints += pointValue * creditValue;

                if (s.id === currentSemester) {
                    currentSemCredits += creditValue;
                    currentSemWeightedPoints += pointValue * creditValue;
                }

                if (isMajor) {
                    majorCredits += creditValue;
                    majorWeightedPoints += pointValue * creditValue;

                    if (s.id === currentSemester) {
                        currentSemMajorCredits += creditValue;
                        currentSemMajorWeightedPoints += pointValue * creditValue;
                    }
                }
            } else if (isPass) {
                // Pass subjects count towards credits if needed
                // totalCredits += creditValue; 
            }
        });
    });

    const cumulativeGPA = totalCredits > 0 ? (totalWeightedPoints / totalCredits).toFixed(2) : "0.00";
    const cumulativeMajorGPA = majorCredits > 0 ? (majorWeightedPoints / majorCredits).toFixed(2) : "0.00";

    const semesterGPA = currentSemCredits > 0 ? (currentSemWeightedPoints / currentSemCredits).toFixed(2) : "0.00";
    const semesterMajorGPA = currentSemMajorCredits > 0 ? (currentSemMajorWeightedPoints / currentSemMajorCredits).toFixed(2) : "0.00";

    // Update modal UI elements (Semester-specific)
    document.querySelector('#calculated-gpa').innerText = semesterGPA;
    document.querySelector('#major-gpa-summary').innerText = semesterMajorGPA;

    // Update dashboard UI elements (Cumulative)
    document.querySelector('#top-gpa-display').innerText = cumulativeGPA;
    document.querySelector('#major-gpa-display').innerText = cumulativeMajorGPA;
    document.querySelector('#total-credits-display').innerText = totalCredits;

    // Save to local storage for persistence
    localStorage.setItem('semesterData', JSON.stringify(semesterData));
}

function addRow() {
    if (!isGpaEditMode) return;
    const newRow = { major: false, credit: 3, name: '', grade: 'A', point: '4.00' };
    semesterData[currentSemester].push(newRow);
    renderSemesterTable();
}

function toggleGpaEditMode() {
    isGpaEditMode = !isGpaEditMode;
    const btn = document.getElementById('gpa-edit-toggle-btn');
    // Static add-row-btn is deprecated in favor of dynamic row

    if (isGpaEditMode) {
        btn.innerText = "SAVE Record";
    } else {
        btn.innerText = "Edit Record";
    }
    renderSemesterTable();
}

function deleteRow(button) {
    if (!isGpaEditMode) return;
    const tr = button.closest('tr');
    const index = Array.from(tr.parentNode.children).indexOf(tr);

    semesterData[currentSemester].splice(index, 1);
    renderSemesterTable();
}

window.currentUserId = "guest";
let isProcessing = false;
let currentMessages = [];
let chatHistory = []; // Will be loaded from backend for logged-in users

// Initialize: Check login state before showing history
// History loading is triggered by initSession() in login.js after successful auth
checkAndUpdateHistoryUI();

function updateChatInputState(isLoggedIn) {
    const input = document.getElementById('chat-input');
    const btn = document.getElementById('send-btn');
    if (isLoggedIn) {
        input.disabled = false;
        input.placeholder = "Type your message...";
        btn.disabled = false;
    } else {
        input.disabled = true;
        input.placeholder = "Please login to chat";
        btn.disabled = true;
    }
}
// Initialize history on load
updateHistoryUI();
initSemesterTabs();
renderSemesterTable();

// --- Course Autocomplete Logic ---
let debounceTimer;

async function debouncedSearch(query, inputElement) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fetchCourseSuggestions(query, inputElement), 300);
}

async function fetchCourseSuggestions(query, inputElement) {
    try {
        const response = await fetch(`/courses/search?query=${encodeURIComponent(query)}`);
        if (response.ok) {
            const courses = await response.json();
            showSuggestions(courses, inputElement);
        }
    } catch (error) {
        console.error("Error fetching courses:", error);
    }
}

function showSuggestions(courses, inputElement) {
    // Remove existing suggestions list if any
    closeAllLists();

    if (courses.length === 0) return;

    const listDiv = document.createElement("div");
    listDiv.setAttribute("class", "autocomplete-items");

    // Calculate position
    const rect = inputElement.getBoundingClientRect();

    listDiv.style.top = (rect.bottom + window.scrollY) + "px";
    listDiv.style.left = (rect.left + window.scrollX) + "px";
    listDiv.style.width = (rect.width * 0.9) + "px";

    // Append to body to avoid overflow clipping from table/modal
    document.body.appendChild(listDiv);

    courses.forEach(course => {
        const item = document.createElement("div");
        item.className = "autocomplete-item";
        item.innerHTML = `
            <div class="suggestion-title">${course.course_name}</div>
            <div class="suggestion-sub">${course.credits} Credits</div>
        `;
        item.addEventListener("click", function (e) {
            e.stopPropagation(); // Prevent immediate closing

            // Update Course Name
            inputElement.value = course.course_name;
            updateRowData(inputElement, 'name');

            // Update Credits (Find the select element in the same row)
            const row = inputElement.closest('tr');
            const creditSelect = row.querySelector('select'); // Accessing the credit select
            if (creditSelect) {
                creditSelect.value = course.credits;
                // Trigger change event manually if needed, or call update logic
                updateRowData(creditSelect, 'credit');
            }

            closeAllLists();
        });
        listDiv.appendChild(item);
    });
}

function closeAllLists(elmnt) {
    const x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != document.getElementById("chat-input")) {
            x[i].parentNode.removeChild(x[i]);
        }
    }
}

// Close lists when clicking outside or scrolling
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});

// Close on scroll to prevent detached floating list
document.addEventListener("scroll", function (e) {
    // Ignore scroll events originating from the autocomplete list itself
    if (e.target && e.target.classList && e.target.classList.contains('autocomplete-items')) return;
    closeAllLists();
}, true); // Capture phase to catch scroll in sub-elements

function toggleLoginModal() {
    loginModal.classList.toggle('is-hidden');
}

const findPasswordModal = document.getElementById('find-password-modal');

function toggleFindPasswordModal() {
    findPasswordModal.classList.toggle('is-hidden');
}

function openFindPasswordModal() {
    // Reset state: show form, hide result
    document.getElementById('find-password-form-container').classList.remove('is-hidden');
    document.getElementById('find-password-result-container').classList.add('is-hidden');
    // Clear inputs
    document.getElementById('find-student-id').value = '';
    document.getElementById('find-email').value = '';

    loginModal.classList.add('is-hidden');
    findPasswordModal.classList.remove('is-hidden');
}

function openLoginModal() {
    findPasswordModal.classList.add('is-hidden');
    loginModal.classList.remove('is-hidden');
}

const passwordSuccessModal = document.getElementById('password-success-modal');

function togglePasswordSuccessModal() {
    // No longer used for a separate modal, but keeping for compatibility if needed
    if (findPasswordModal.classList.contains('is-hidden')) {
        openFindPasswordModal();
    } else {
        findPasswordModal.classList.add('is-hidden');
    }
}

function openPasswordSuccessModal(password) {
    // Updated to show result in-place
    document.getElementById('find-password-form-container').classList.add('is-hidden');
    document.getElementById('recovered-password-display').innerText = password;
    document.getElementById('find-password-result-container').classList.remove('is-hidden');
}

function openLoginModalFromSuccess() {
    findPasswordModal.classList.add('is-hidden');
    loginModal.classList.remove('is-hidden');
}

const profileModal = document.getElementById('profile-modal');
function toggleProfileModal() { profileModal.classList.toggle('is-hidden'); }

const loginRequiredModal = document.getElementById('login-required-modal');
function toggleLoginRequiredModal() { loginRequiredModal.classList.toggle('is-hidden'); }

function openLoginFromRequired() {
    toggleLoginRequiredModal();
    toggleLoginModal();
}

async function handleSettingsClick() {
    if (window.currentUserId === "guest") {
        toggleLoginRequiredModal();
        return;
    }

    try {
        const response = await fetch(`/auth/profile/${window.currentUserId}`);
        const data = await response.json();

        if (response.ok && !data.detail) {
            document.getElementById('profile-name').innerText = data.name;
            document.getElementById('profile-id').innerText = data.user_id;
            document.getElementById('profile-major').innerText = data.major;
            document.getElementById('profile-grade').innerText = `${data.grade} 학년`;
            document.getElementById('profile-credits').innerText = `${data.credits} 학점`;
            document.getElementById('profile-email').innerText = data.email;
            toggleProfileModal();
        } else {
            alert(data.detail || "정보를 불러오지 못했습니다.");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("정보를 가져오는 중 오류가 발생했습니다.");
    }
}


function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('password-toggle-icon');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.innerText = 'visibility_off';
    } else {
        passwordInput.type = 'password';
        toggleIcon.innerText = 'visibility';
    }
}

function checkAndUpdateHistoryUI() {
    // Check if user is logged in (not guest)
    if (window.currentUserId === "guest" || !window.currentUserId) {
        // Show login prompt instead of history
        const header = historyList.querySelector('p');
        historyList.innerHTML = '';
        if (header) historyList.appendChild(header);

        const loginPrompt = document.createElement('div');
        loginPrompt.className = 'history-empty';
        loginPrompt.innerHTML = `
            <span class="material-symbols-outlined">lock</span>
            <p>Login to save and view<br>your chat history</p>
        `;
        historyList.appendChild(loginPrompt);
        return;
    }

    // User is logged in, display chat history
    updateHistoryUI();
}

function updateHistoryUI() {
    const header = historyList.querySelector('p');
    historyList.innerHTML = '';
    if (header) historyList.appendChild(header);

    if (chatHistory.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'history-empty';
        emptyMsg.textContent = 'No conversations yet';
        historyList.appendChild(emptyMsg);
        return;
    }

    const sortedHistory = [...chatHistory].map((chat, originalIndex) => ({ ...chat, originalIndex }))
        .sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return b.originalIndex - a.originalIndex;
        });

    sortedHistory.forEach((chat) => {
        const item = document.createElement('div');
        item.className = "history-item";

        const pinClass = chat.isPinned ? 'is-pinned' : '';
        const chatId = chat.id || chat.originalIndex;

        item.innerHTML = `
            <div id="display-container-${chatId}" class="history-item__content" onclick="loadChat('${chatId}')">
                <div class="history-item__text">
                    <p class="history-item__title">${chat.title}</p>
                    <p class="history-item__time">${chat.time || ''}</p>
                </div>
                <div class="history-item__actions">
                    <button onclick="event.stopPropagation(); togglePinChat('${chatId}')" class="icon-btn ${pinClass}" title="Pin">
                        <span class="material-symbols-outlined">push_pin</span>
                    </button>
                    <button onclick="event.stopPropagation(); deleteChat('${chatId}')" class="icon-btn delete" title="Delete">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
        `;
        historyList.appendChild(item);
    });
}

// Load chat history from backend API
async function loadChatHistoryFromBackend() {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
        const response = await fetch('/chat/history', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const data = await response.json();
            chatHistory = data.chats.map(c => ({
                id: c.id,
                title: c.title,
                messages: c.messages,
                isPinned: c.is_pinned,
                time: new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
            updateHistoryUI();
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

// Save current chat to backend
async function saveChatToBackend() {
    if (window.currentUserId === "guest" || !window.currentUserId) return;
    if (currentMessages.length === 0) return;

    const token = localStorage.getItem('access_token');
    if (!token) return;

    const title = currentMessages.find(m => m.role === 'user')?.content.substring(0, 50) || "New Conversation";

    try {
        const response = await fetch('/chat/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: title,
                messages: currentMessages.map(m => ({ role: m.role, content: m.content }))
            })
        });
        if (response.ok) {
            await loadChatHistoryFromBackend();
        }
    } catch (error) {
        console.error('Error saving chat:', error);
    }
}

async function togglePinChat(chatId) {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const chat = chatHistory.find(c => c.id === chatId);
    if (!chat) return;

    try {
        await fetch(`/chat/history/${chatId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ is_pinned: !chat.isPinned })
        });
        await loadChatHistoryFromBackend();
    } catch (error) {
        console.error('Error toggling pin:', error);
    }
}

function showRenameUI(index) {
    document.getElementById(`display-container-${index}`).classList.add('is-hidden');
    const renameContainer = document.getElementById(`rename-container-${index}`);
    renameContainer.classList.remove('is-hidden');
    renameContainer.classList.add('is-visible');
    const input = document.getElementById(`rename-input-${index}`);
    input.value = chatHistory[index].title;
    input.focus();
    input.select();
}

function cancelRename(index) {
    document.getElementById(`display-container-${index}`).classList.remove('is-hidden');
    const renameContainer = document.getElementById(`rename-container-${index}`);
    renameContainer.classList.add('is-hidden');
    renameContainer.classList.remove('is-visible');
}

function saveRename(index) {
    const input = document.getElementById(`rename-input-${index}`);
    const newTitle = input.value.trim();
    if (newTitle !== "") {
        chatHistory[index].title = newTitle;
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        updateHistoryUI();
    } else {
        cancelRename(index);
    }
}

async function deleteChat(chatId) {
    if (!confirm("Are you sure you want to delete this conversation?")) return;

    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
        await fetch(`/chat/history/${chatId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        await loadChatHistoryFromBackend();
    } catch (error) {
        console.error('Error deleting chat:', error);
    }
}

async function startNewChat() {
    // Save current chat to backend if there are messages and user is logged in
    if (currentMessages.length > 0 && window.currentUserId !== "guest" && window.currentUserId) {
        await saveChatToBackend();
    }

    currentMessages = [];
    chatContainer.innerHTML = `
        <div class="message message--ai">
            <div class="avatar">
                <img src="/static/character.jpg" alt="AI Avatar">
            </div>
            <div class="bubble bubble--ai">
                <p>
                    Hello! I am your UCSI University academic assistant. How can I help you today? Feel free to ask about academic schedules, course registration, graduation requirements, or anything else.
                </p>
            </div>
        </div>
    `;
    chatContainer.scrollTop = 0;
}

async function loadChat(chatId) {
    const chat = chatHistory.find(c => c.id === chatId || c.originalIndex === chatId);
    if (!chat) return;
    currentMessages = [...chat.messages];
    chatContainer.innerHTML = '';
    currentMessages.forEach(m => renderMessage(m.role, m.content));
}

function renderMessage(role, content) {
    const wrapper = document.createElement('div');
    wrapper.className = role === 'user' ? 'message message--user' : 'message message--ai';
    if (role === 'user') {
        wrapper.innerHTML = `
            <div class="bubble bubble--user">
                <p>${content}</p>
            </div>
        `;
    } else {
        wrapper.innerHTML = `
            <div class="avatar">
                <img src="/static/character.jpg" alt="AI Avatar">
            </div>
            <div class="bubble bubble--ai">
                <p>${content}</p>
            </div>
        `;
    }
    chatContainer.appendChild(wrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function appendMessage(role, content) {
    currentMessages.push({ role, content });
    renderMessage(role, content);
}

function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'ai-loader';
    loader.className = 'message message--ai';
    loader.innerHTML = `
        <div class="avatar">
            <img src="/static/character.jpg" alt="AI Avatar">
        </div>
        <div class="bubble bubble--ai bubble--loading">
            <div class="typing-dots">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        </div>
    `;
    chatContainer.appendChild(loader);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function removeLoading() {
    const loader = document.getElementById('ai-loader');
    if (loader) loader.remove();
}

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message || isProcessing) return;
    chatInput.value = '';
    isProcessing = true;
    appendMessage('user', message);
    showLoading();

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message, user_id: window.currentUserId })
        });
        const data = await response.json();
        removeLoading();
        appendMessage('ai', data.response);
    } catch (error) {
        console.error('Error:', error);
        removeLoading();
        appendMessage('ai', 'An error occurred. Please try again.');
    } finally {
        isProcessing = false;
    }
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
