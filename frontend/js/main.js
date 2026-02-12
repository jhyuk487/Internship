const chatContainer = document.getElementById('chat-container');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const loginModal = document.getElementById('login-modal');
const gradeModal = document.getElementById('grade-modal');
const historyList = document.getElementById('history-list');
const conversationTitle = document.getElementById('conversation-title');
let isGpaEditMode = false;
let currentSemester = "Y1S1";

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('sidebar--collapsed');
}

// Structure for 5 years, 3 semesters each
const semesters = [
    { id: 'Y1S1', label: '1-1' }, { id: 'Y1S2', label: '1-2' }, { id: 'Y1S3', label: '1-3' },
    { id: 'Y2S1', label: '2-1' }, { id: 'Y2S2', label: '2-2' }, { id: 'Y2S3', label: '2-3' },
    { id: 'Y3S1', label: '3-1' }, { id: 'Y3S2', label: '3-2' }, { id: 'Y3S3', label: '3-3' },
    { id: 'Y4S1', label: '4-1' }, { id: 'Y4S2', label: '4-2' }, { id: 'Y4S3', label: '4-3' }
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
            class="semester-tab ${currentSemester === s.id ? 'semester-tab--active' : 'semester-tab--inactive'}">
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
        secondaryBtn.classList.remove('hidden');
        secondaryBtn.innerText = options.secondaryText || "Cancel";
    } else {
        secondaryBtn.classList.add('hidden');
    }

    modal.classList.remove('hidden');

    return new Promise((resolve) => {
        const handlePrimary = () => {
            modal.classList.add('hidden');
            primaryBtn.removeEventListener('click', handlePrimary);
            secondaryBtn.removeEventListener('click', handleSecondary);
            closeBtn.removeEventListener('click', handleClose);
            resolve(true);
        };
        const handleSecondary = () => {
            modal.classList.add('hidden');
            primaryBtn.removeEventListener('click', handlePrimary);
            secondaryBtn.removeEventListener('click', handleSecondary);
            closeBtn.removeEventListener('click', handleClose);
            resolve(false);
        };
        const handleClose = () => {
            modal.classList.add('hidden');
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
        // If they continue, we revert edit mode to sync UI correctly (discard changes)
        await toggleGpaEditMode({ save: false });
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
                <td colspan="6" class="grade-empty">
                    No courses added yet. Click <span class="grade-empty__highlight">'Edit Record'</span> to start.
                </td>
            `;
            tbody.appendChild(tr);
        }
    } else {
        data.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.className = "grade-row";
            tr.innerHTML = `
                <td class="grade-cell grade-cell--center">
                    <input type="checkbox" onchange="updateRowData(this, 'major')" class="grade-checkbox" ${row.major ? 'checked' : ''} ${!isGpaEditMode ? 'disabled' : ''}>
                </td>
                <td class="grade-cell">
                    <select onchange="updateRowData(this, 'credit')" class="grade-select grade-select--credit ${!isGpaEditMode ? 'grade-select--readonly' : ''}" ${!isGpaEditMode ? 'disabled' : ''}>
                        <option value="2" ${row.credit == 2 ? 'selected' : ''}>2</option>
                        <option value="3" ${row.credit == 3 ? 'selected' : ''}>3</option>
                        <option value="4" ${row.credit == 4 ? 'selected' : ''}>4</option>
                    </select>
                </td>
                <td class="grade-cell">
                    <input onfocus="updateRowData(this, 'name')" oninput="updateRowData(this, 'name')" class="grade-input" type="text" placeholder="Search Course..." value="${row.name}" ${!isGpaEditMode ? 'disabled' : ''} />
                </td>
                <td class="grade-cell grade-cell--center">
                    <input class="grade-point-input" value="${row.point}" readonly />
                </td>
                <td class="grade-cell grade-cell--center">
                    <div class="grade-select-wrap">
                        <select onchange="updateRowPoint(this)" 
                            class="grade-select grade-select--grade ${!isGpaEditMode ? 'grade-select--readonly' : ''}" 
                            ${!isGpaEditMode ? 'disabled' : ''}
                            >
                            ${Object.keys(gradeMapping).map(g => `<option value="${g}" ${row.grade === g || (row.grade === undefined && g === 'A') ? 'selected' : ''}>${g}</option>`).join('')}
                        </select>
                    </div>
                </td>
                <td class="grade-cell grade-cell--right">
                    <button onclick="deleteRow(this)" class="grade-delete-btn ${!isGpaEditMode ? 'hidden' : ''}"><span class="material-symbols-outlined">delete</span></button>
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
            <td colspan="6" class="grade-cell grade-cell--full grade-cell--no-padding">
                <button onclick="addRow()" class="grade-add-btn">
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
        if (element.dataset.autocompleteSuppress === '1') {
            delete element.dataset.autocompleteSuppress;
            return;
        }
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
    gradeModal.classList.toggle('grade-modal--closed');
    if (!gradeModal.classList.contains('grade-modal--closed')) {
        initSemesterTabs();
        renderSemesterTable();
    }
}

function closeGradeModal() {
    if (gradeModal && !gradeModal.classList.contains('grade-modal--closed')) {
        gradeModal.classList.add('grade-modal--closed');
    }
}

const gradeMapping = {
    'A': '4.00', 'A-': '3.67', 'B+': '3.33', 'B': '3.00', 'B-': '2.67',
    'C+': '2.33', 'C': '2.00', 'C-': '1.67', 'D+': '1.00', 'D': '1.00',
    'D-': '1.00', 'F': '0.00', 'P': ''
};

function mapSemesterDataToTerms() {
    const terms = {};
    semesters.forEach(s => {
        const rows = semesterData[s.id] || [];
        terms[s.id] = rows.map(row => ({
            course_code: row.course_code || null,
            course_name: row.name || null,
            credits: Number(row.credit) || 0,
            grade: row.grade || 'A',
            is_major: !!row.major
        }));
    });
    return terms;
}

function applyTermsToSemesterData(terms) {
    const next = {};
    semesters.forEach(s => {
        const rows = (terms && terms[s.id]) || [];
        next[s.id] = rows.map(entry => {
            const grade = entry.grade || 'A';
            return {
                major: !!entry.is_major,
                credit: entry.credits ?? 3,
                course_code: entry.course_code || null,
                name: entry.course_name || entry.course_code || '',
                grade,
                point: gradeMapping[grade] || ''
            };
        });
    });
    semesterData = next;
}

async function loadGradeRecordsFromBackend() {
    if (window.currentUserId === "guest" || !window.currentUserId) return;
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
        const response = await fetch('/grades/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const data = await response.json();
            applyTermsToSemesterData(data.terms || {});
            initSemesterTabs();
            renderSemesterTable();
        }
    } catch (error) {
        console.error('Error loading grade records:', error);
    }
}

async function saveGradeRecordsToBackend() {
    if (window.currentUserId === "guest" || !window.currentUserId) return;
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
        await fetch('/grades/me', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ terms: mapSemesterDataToTerms() })
        });
    } catch (error) {
        console.error('Error saving grade records:', error);
    }
}

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

    // Save to local storage for persistence (guest only)
    if (window.currentUserId === "guest" || !window.currentUserId) {
        return;
    }
}

function addRow() {
    if (!isGpaEditMode) return;
    const newRow = { major: false, credit: 3, name: '', grade: 'A', point: '4.00' };
    semesterData[currentSemester].push(newRow);
    renderSemesterTable();
}

async function toggleGpaEditMode(options = { save: true }) {
    const { save } = options;
    const wasEditing = isGpaEditMode;
    isGpaEditMode = !isGpaEditMode;
    const btn = document.getElementById('gpa-edit-toggle-btn');
    // Static add-row-btn is deprecated in favor of dynamic row

    if (isGpaEditMode) {
        btn.innerText = "SAVE Record";
    } else {
        btn.innerText = "Edit Record";
    }
    if (wasEditing && !isGpaEditMode && save) {
        await saveGradeRecordsToBackend();
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
const GUEST_CHAT_KEY = 'guestChatHistory';
const WELCOME_MESSAGE = "## Hello! I am your UCSI University academic assistant.\n\nHow can I help you today?\n\nYou can ask about:\n- Academic schedules\n- Course registration\n- Graduation requirements\n- Anything else you need";
let currentLoadedChatId = null;
let isViewingHistoryChat = false;
let isNewChat = false;
const ALLOW_GUEST_CHAT = true;

// Initialize: Check login state before showing history
// History loading is triggered by initSession() in login.js after successful auth
checkAndUpdateHistoryUI();

function updateChatInputState(isLoggedIn) {
    const input = document.getElementById('chat-input');
    const btn = document.getElementById('send-btn');
    if (!input || !btn) return;

    if (isLoggedIn || ALLOW_GUEST_CHAT) {
        input.disabled = false;
        input.placeholder = "Type your message...";
        btn.disabled = false;
    } else {
        input.disabled = true;
        input.placeholder = "Please login to chat";
        btn.disabled = true;
    }
}

function setChatInteractionEnabled(enabled) {
    const input = document.getElementById('chat-input');
    const btn = document.getElementById('send-btn');
    const history = document.getElementById('history-list');
    const newChatBtn = document.getElementById('new-chat-btn');

    if (input) input.disabled = !enabled;
    if (btn) btn.disabled = !enabled;
    if (newChatBtn) newChatBtn.disabled = !enabled;
    if (history) {
        history.classList.toggle('is-disabled', !enabled);
    }
}

function setConversationTitle(title) {
    if (!conversationTitle) return;
    conversationTitle.textContent = title || "Current Conversation";
}

// Initialize history on load
updateHistoryUI();
updateChatInputState(window.currentUserId !== "guest");
initSemesterTabs();
renderSemesterTable();
loadGuestChatFromStorage();

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
    listDiv.setAttribute("class", "autocomplete-list");

    // Calculate position
    const rect = inputElement.getBoundingClientRect();

    listDiv.style.left = (rect.left + window.scrollX) + "px";
    listDiv.style.width = (rect.width * 0.9) + "px";

    // Append to body to avoid overflow clipping from table/modal
    document.body.appendChild(listDiv);

    // Default to below the input
    listDiv.style.top = (rect.bottom + window.scrollY) + "px";

    courses.forEach(course => {
        const item = document.createElement("div");
        item.className = "autocomplete-item";
        item.innerHTML = `
            <div class="autocomplete-item__content">
                <span class="autocomplete-item__title">${course.course_name}</span>
                <span class="autocomplete-item__meta">${course.credits} Credits</span>
            </div>
        `;
        item.addEventListener("click", function (e) {
            e.stopPropagation(); // Prevent immediate closing

            // Update Course Name
            inputElement.value = course.course_name;
            inputElement.dataset.autocompleteSuppress = '1';
            updateRowData(inputElement, 'name');

            // Update Credits (Find the select element in the same row)
            const row = inputElement.closest('tr');
            const creditSelect = row.querySelector('select'); // Accessing the credit select
            if (creditSelect) {
                creditSelect.value = course.credits;
                // Trigger change event manually if needed, or call update logic
                updateRowData(creditSelect, 'credit');
            }

            // Store course code for backend grade records
            const rowIndex = Array.from(row.parentNode.children).indexOf(row);
            if (rowIndex >= 0) {
                const courseCode = course.course_unique_id || course.course_code || null;
                semesterData[currentSemester][rowIndex].course_code = courseCode;
            }

            closeAllLists();
        });
        listDiv.appendChild(item);
    });

    // If dropdown overflows viewport bottom, flip above the input
    const listRect = listDiv.getBoundingClientRect();
    if (listRect.bottom > window.innerHeight) {
        const top = rect.top + window.scrollY - listRect.height - 8;
        listDiv.style.top = Math.max(8 + window.scrollY, top) + "px";
    }
}

function closeAllLists(elmnt) {
    const x = document.getElementsByClassName("autocomplete-list");
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
    if (e.target && e.target.classList && e.target.classList.contains('autocomplete-list')) return;
    closeAllLists();
}, true); // Capture phase to catch scroll in sub-elements

function toggleLoginModal() {
    loginModal.classList.toggle('hidden');
}

const findPasswordModal = document.getElementById('find-password-modal');

function toggleFindPasswordModal() {
    findPasswordModal.classList.toggle('hidden');
}

function openFindPasswordModal() {
    // Reset state: show form, hide result
    document.getElementById('find-password-form-container').classList.remove('hidden');
    document.getElementById('find-password-result-container').classList.add('hidden');
    // Clear inputs
    document.getElementById('find-student-id').value = '';
    document.getElementById('find-email').value = '';

    loginModal.classList.add('hidden');
    findPasswordModal.classList.remove('hidden');
}

function openLoginModal() {
    findPasswordModal.classList.add('hidden');
    loginModal.classList.remove('hidden');
}

const passwordSuccessModal = document.getElementById('password-success-modal');

function togglePasswordSuccessModal() {
    // No longer used for a separate modal, but keeping for compatibility if needed
    if (findPasswordModal.classList.contains('hidden')) {
        openFindPasswordModal();
    } else {
        findPasswordModal.classList.add('hidden');
    }
}

function openPasswordSuccessModal(password) {
    // Updated to show result in-place
    document.getElementById('find-password-form-container').classList.add('hidden');
    const display = document.getElementById('recovered-password-display');
    if (display) {
        display.innerText = password || "Verified (hidden)";
    }
    document.getElementById('find-password-result-container').classList.remove('hidden');
}

function openLoginModalFromSuccess() {
    findPasswordModal.classList.add('hidden');
    loginModal.classList.remove('hidden');
}

const profileModal = document.getElementById('profile-modal');
function toggleProfileModal() { profileModal.classList.toggle('hidden'); }

const loginRequiredModal = document.getElementById('login-required-modal');
function toggleLoginRequiredModal() { loginRequiredModal.classList.toggle('hidden'); }

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
            document.getElementById('profile-grade').innerText = `Year ${data.grade}`;
            document.getElementById('profile-credits').innerText = `${data.credits} credits`;
            document.getElementById('profile-email').innerText = data.email;
            toggleProfileModal();
        } else {
            alert(data.detail || "Unable to load information.");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("An error occurred while fetching information.");
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
        historyList.innerHTML = '';

        const loginPrompt = document.createElement('div');
        loginPrompt.className = 'history-guest guest-prompt';
        loginPrompt.innerHTML = `
            <span class="material-symbols-outlined history-guest__icon">lock</span>
            <p class="history-guest__text sidebar-text">Login to save and view<br>your chat history</p>
        `;
        historyList.appendChild(loginPrompt);
        return;
    }

    // User is logged in, display chat history
    updateHistoryUI();
}

function ensureGuestWelcomeMessage() {
    if (!currentMessages.some(m => m.role === 'ai' && m.content === WELCOME_MESSAGE)) {
        currentMessages.unshift({ role: 'ai', content: WELCOME_MESSAGE });
    }
}

function loadGuestChatFromStorage() {
    if (window.currentUserId !== "guest") return;
    try {
        const stored = JSON.parse(sessionStorage.getItem(GUEST_CHAT_KEY) || '[]');
        if (Array.isArray(stored) && stored.length > 0) {
            currentMessages = stored;
            ensureGuestWelcomeMessage();
            chatContainer.innerHTML = '';
            currentMessages.forEach(m => renderMessage(m.role, m.content));
        } else {
            currentMessages = [{ role: 'ai', content: WELCOME_MESSAGE }];
            chatContainer.innerHTML = '';
            renderMessage('ai', WELCOME_MESSAGE);
        }
    } catch {
        currentMessages = [{ role: 'ai', content: WELCOME_MESSAGE }];
        chatContainer.innerHTML = '';
        renderMessage('ai', WELCOME_MESSAGE);
    }
}

function saveGuestChatToStorage() {
    if (window.currentUserId !== "guest") return;
    sessionStorage.setItem(GUEST_CHAT_KEY, JSON.stringify(currentMessages));
}

function isSameLocalDate(a, b) {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate();
}

function formatChatTime(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const now = new Date();
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (isSameLocalDate(date, now)) {
        return time;
    }
    const day = date.toLocaleDateString();
    return `${day} ${time}`;
}

function getChatSortTime(chat) {
    const value = chat.updatedAt || chat.updated_at || chat.createdAt || chat.created_at;
    const time = value ? new Date(value).getTime() : 0;
    return Number.isNaN(time) ? 0 : time;
}

function updateHistoryUI() {
    // If guest, keep the locked prompt instead of empty history
    if (window.currentUserId === "guest" || !window.currentUserId) {
        checkAndUpdateHistoryUI();
        return;
    }
    historyList.innerHTML = '';

    if (chatHistory.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'history-empty';
        emptyMsg.textContent = 'No conversations yet';
        historyList.appendChild(emptyMsg);
        return;
    }

    const sortedHistory = [...chatHistory]
        .map((chat, originalIndex) => ({
            ...chat,
            originalIndex,
            sortTime: getChatSortTime(chat)
        }))
        .sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            const timeDiff = b.sortTime - a.sortTime;
            if (timeDiff !== 0) return timeDiff;
            return b.originalIndex - a.originalIndex;
        });

    sortedHistory.forEach((chat) => {
        const item = document.createElement('div');
        item.className = 'history-item';
        if (chat.isPinned) {
            item.classList.add('history-item--pinned', 'pinned-chat');
        } else {
            item.classList.add('history-item--default');
        }

        const pinButtonClass = chat.isPinned ? 'history-action history-action--pin is-pinned' : 'history-action history-action--pin';
        const chatId = chat.id || chat.originalIndex;
        const isSelected = String(chatId) === String(currentLoadedChatId);

        const displayTime = formatChatTime(chat.updatedAt || chat.createdAt) || chat.time || '';
        item.innerHTML = `
            ${isSelected ? '<span class="history-item__marker"></span>' : ''}
            <div id="display-container-${chatId}" class="history-item__content">
                <div class="history-item__main">
                    <div class="history-item__title-row">
                        <p class="history-item__title">${chat.title}</p>
                        ${chat.isPinned ? '<span class="material-symbols-outlined history-item__pin-tag">push_pin</span>' : ''}
                    </div>
                    <p class="history-item__time">${displayTime}</p>
                </div>
                <div class="history-item__actions">
                    <button onclick="event.stopPropagation(); togglePinChat('${chatId}')" class="${pinButtonClass}" title="${chat.isPinned ? 'Unpin' : 'Pin'}">
                        <span class="material-symbols-outlined history-action__icon">push_pin</span>
                    </button>
                    <button onclick="event.stopPropagation(); showRenameUI('${chatId}')" class="history-action history-action--edit" title="Rename">
                        <span class="material-symbols-outlined history-action__icon">edit</span>
                    </button>
                    <button onclick="event.stopPropagation(); deleteChat('${chatId}')" class="history-action history-action--delete" title="Delete">
                        <span class="material-symbols-outlined history-action__icon">delete</span>
                    </button>
                </div>
            </div>
            <div id="rename-container-${chatId}" class="history-rename hidden">
                <input id="rename-input-${chatId}" type="text"
                    class="history-rename__input"
                    onkeyup="if(event.key === 'Enter') saveRename('${chatId}')"
                    onclick="event.stopPropagation()">
                <div class="history-rename__actions">
                    <button onclick="event.stopPropagation(); saveRename('${chatId}')" class="history-rename__button history-rename__button--confirm">
                        <span class="material-symbols-outlined history-rename__icon">check</span>
                    </button>
                    <button onclick="event.stopPropagation(); cancelRename('${chatId}')" class="history-rename__button history-rename__button--cancel">
                        <span class="material-symbols-outlined history-rename__icon">close</span>
                    </button>
                </div>
            </div>
        `;
        item.onclick = () => loadChat(`${chatId}`);
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
            chatHistory = data.chats.map(c => {
                const updatedAt = c.updated_at || c.created_at;
                return {
                    id: c.id,
                    title: c.title,
                    messages: c.messages,
                    isPinned: c.is_pinned,
                    createdAt: c.created_at,
                    updatedAt: updatedAt,
                    time: formatChatTime(updatedAt)
                };
            });
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
            const data = await response.json();
            currentLoadedChatId = data.id || currentLoadedChatId;
            isViewingHistoryChat = false;
            await loadChatHistoryFromBackend();
            return data;
        }
    } catch (error) {
        console.error('Error saving chat:', error);
    }
}

async function updateChatMessages(chatId) {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
        await fetch(`/chat/history/${chatId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                messages: currentMessages.map(m => ({ role: m.role, content: m.content }))
            })
        });
        const chat = chatHistory.find(c => String(c.id) === String(chatId));
        if (chat) {
            chat.messages = [...currentMessages];
            const now = new Date().toISOString();
            chat.updatedAt = now;
            chat.time = formatChatTime(now);
        }
        updateHistoryUI();
    } catch (error) {
        console.error('Error updating chat:', error);
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

function showRenameUI(chatId) {
    document.getElementById(`display-container-${chatId}`).classList.add('hidden');
    const renameContainer = document.getElementById(`rename-container-${chatId}`);
    renameContainer.classList.remove('hidden');
    const input = document.getElementById(`rename-input-${chatId}`);
    const chat = chatHistory.find(c => String(c.id) === String(chatId) || String(c.originalIndex) === String(chatId));
    input.value = chat?.title || '';
    input.focus();
    input.select();
}

function cancelRename(chatId) {
    document.getElementById(`display-container-${chatId}`).classList.remove('hidden');
    const renameContainer = document.getElementById(`rename-container-${chatId}`);
    renameContainer.classList.add('hidden');
}

async function saveRename(chatId) {
    const input = document.getElementById(`rename-input-${chatId}`);
    const newTitle = input.value.trim();
    if (newTitle === "") {
        cancelRename(chatId);
        return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
        const response = await fetch(`/chat/history/${chatId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title: newTitle })
        });
        if (response.ok) {
            const data = await response.json();
            const chat = chatHistory.find(c => String(c.id) === String(chatId));
            if (chat) {
                chat.title = data.title || newTitle;
                const updatedAt = data.updated_at || data.created_at || new Date().toISOString();
                chat.updatedAt = updatedAt;
                chat.time = formatChatTime(updatedAt);
            }
            updateHistoryUI();
        } else {
            cancelRename(chatId);
        }
    } catch (error) {
        console.error('Error renaming chat:', error);
        cancelRename(chatId);
    }
}

async function deleteChat(chatId) {
    if (!confirm("Are you sure you want to delete this conversation?")) return;

    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
        const response = await fetch(`/chat/history/${chatId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            if (String(chatId) === String(currentLoadedChatId)) {
                startNewChat({ suppressGuestConfirm: true });
            }
            await loadChatHistoryFromBackend();
        }
    } catch (error) {
        console.error('Error deleting chat:', error);
    }
}

async function startNewChat(options = {}) {
    closeGradeModal();

    if (isNewChat) {
        return;
    }

    const isGuest = window.currentUserId === "guest" || !window.currentUserId;
    const { suppressGuestConfirm = false, clearGuestHistory = false } = options;

    if (isGuest) {
        if (!suppressGuestConfirm) {
            const confirmed = await showCustomModal({
                title: "Clear Guest History",
                message: "Starting a new chat will clear your guest conversation history. Do you want to continue?",
                icon: "warning",
                primaryText: "Clear and Start",
                showSecondary: true,
                secondaryText: "Cancel"
            });
            if (!confirmed) {
                return;
            }
            sessionStorage.removeItem(GUEST_CHAT_KEY);
        } else if (clearGuestHistory) {
            sessionStorage.removeItem(GUEST_CHAT_KEY);
        }
    }

    currentMessages = [{ role: 'ai', content: WELCOME_MESSAGE }];
    currentLoadedChatId = null;
    isViewingHistoryChat = false;
    isNewChat = true;
    setConversationTitle("New Conversation");

    if (window.currentUserId === "guest" || !window.currentUserId) {
        saveGuestChatToStorage();
    }
    chatContainer.innerHTML = '';
    renderMessage('ai', WELCOME_MESSAGE);
    chatContainer.scrollTop = 0;
    updateHistoryUI();
}

async function loadChat(chatId) {
    closeGradeModal();

    const chat = chatHistory.find(c => String(c.id) === String(chatId) || String(c.originalIndex) === String(chatId));
    if (!chat) return;
    currentLoadedChatId = chat.id || null;
    isViewingHistoryChat = true;
    isNewChat = false;
    setConversationTitle(chat.title || "Current Conversation");
    currentMessages = [...chat.messages];
    chatContainer.innerHTML = '';
    currentMessages.forEach(m => renderMessage(m.role, m.content));
    updateHistoryUI();
}

function renderMessage(role, content, isStreaming = false) {
    const wrapper = document.createElement('div');
    wrapper.className = role === 'user' ? 'chat-message chat-message--user' : 'chat-message chat-message--ai';
    if (role === 'user') {
        wrapper.innerHTML = `
            <div class="chat-bubble chat-bubble--user">
                <p class="message-content">${content}</p>
            </div>
        `;
    } else {
        const isWelcome = content === WELCOME_MESSAGE;
        const msgIndex = currentMessages.length - 1;

        let contentHtml = content;
        if (!isStreaming) {
            contentHtml = window.DOMPurify ? DOMPurify.sanitize(marked.parse(content)) : content;
        }

        wrapper.innerHTML = `
            <div class="chat-avatar">
                <img src="/static/character.jpg" alt="AI Avatar" class="chat-avatar__image">
            </div>
            <div class="chat-bubble-wrap">
                <div class="chat-bubble chat-bubble--ai ai-bubble">
                    <div class="message-content">${contentHtml}</div>
                </div>
                ${(!isWelcome && !isStreaming) ? `
                <div class="feedback-bar">
                    <button onclick="handleFeedback(this, 'like', ${msgIndex})" class="feedback-btn" title="Useful">
                        <span class="material-icons">thumb_up</span>
                    </button>
                    <button onclick="handleFeedback(this, 'dislike', ${msgIndex})" class="feedback-btn" title="Not Useful">
                        <span class="material-icons">thumb_down</span>
                    </button>
                </div>
                ` : ''}
            </div>
        `;
    }
    chatContainer.appendChild(wrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return wrapper;
}

async function appendMessage(role, content, skipRendering = false) {
    currentMessages.push({ role, content });
    if (!skipRendering) {
        renderMessage(role, content);
    }

    if (window.currentUserId === "guest" || !window.currentUserId) {
        ensureGuestWelcomeMessage();
        saveGuestChatToStorage();
        return;
    }

    if (isNewChat && role === 'user') {
        isNewChat = false;
        if (currentMessages.length > 1) {
            setConversationTitle(content || "Current Conversation");
        }
    }

    if (!currentLoadedChatId && role === 'user') {
        await saveChatToBackend();
        return;
    }

    await updateChatMessages(currentLoadedChatId);
}

function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'ai-loader';
    loader.className = 'chat-message chat-message--ai';
    loader.innerHTML = `
        <div class="chat-avatar">
            <img src="/static/character.jpg" alt="AI Avatar" class="chat-avatar__image">
        </div>
        <div class="chat-bubble-wrap">
            <div class="chat-bubble chat-bubble--ai ai-bubble">
                <div class="typing-dots text-primary">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
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
    setChatInteractionEnabled(false);
    appendMessage('user', message);
    showLoading();

    try {
        // Prepare conversation history (exclude welcome message and current user message)
        const conversationHistory = currentMessages
            .filter(m => m.content !== WELCOME_MESSAGE)
            .slice(0, -1) // Exclude the message we just added
            .map(m => ({ role: m.role, content: m.content }));

        const token = localStorage.getItem('access_token');
        const response = await fetch('/chat/stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
                message: message,
                user_id: window.currentUserId,
                conversation_history: conversationHistory
            })
        });

        if (!response.ok) throw new Error('Network response was not ok');

        // Prepare streaming bubble (hidden initially)
        let fullResponse = "";
        const aiWrapper = renderMessage('ai', "", true);
        aiWrapper.classList.add('hidden'); // Hide until we actually have text
        const contentDiv = aiWrapper.querySelector('.message-content');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        // Character queue for steady typing
        let charQueue = [];
        let isTypingFinished = false;
        let hasStartedStreaming = false;

        // Consumer loop: Draws characters from the queue at a steady pace
        const typingLoop = async () => {
            while (true) {
                if (charQueue.length > 0) {
                    if (!hasStartedStreaming) {
                        hasStartedStreaming = true;
                        removeLoading(); // Keep "..." until we have content!
                        aiWrapper.classList.remove('hidden');
                    }
                    const nextChar = charQueue.shift();
                    fullResponse += nextChar;
                    contentDiv.innerText = fullResponse;
                    chatContainer.scrollTop = chatContainer.scrollHeight;

                    // Faster typing delay (approx 10ms per char)
                    await new Promise(r => setTimeout(r, 10));
                } else if (isTypingFinished) {
                    break;
                } else {
                    await new Promise(r => setTimeout(r, 10));
                }
            }
        };

        const typingPromise = typingLoop();

        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                isTypingFinished = true;
                break;
            }
            const chunk = decoder.decode(value, { stream: true });
            for (let char of chunk) {
                charQueue.push(char);
            }
        }

        await typingPromise;

        // Finalize: Render Markdown and add feedback buttons
        const finalizedHtml = window.DOMPurify ? DOMPurify.sanitize(marked.parse(fullResponse)) : fullResponse;
        contentDiv.innerHTML = finalizedHtml;

        // Add feedback buttons
        const msgIndex = currentMessages.length; // Will be pushed below
        const bubbleContainer = aiWrapper.querySelector('.chat-bubble-wrap');
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = "feedback-bar";
        feedbackDiv.innerHTML = `
            <button onclick="handleFeedback(this, 'like', ${msgIndex})" class="feedback-btn" title="Useful">
                <span class="material-icons">thumb_up</span>
            </button>
            <button onclick="handleFeedback(this, 'dislike', ${msgIndex})" class="feedback-btn" title="Not Useful">
                <span class="material-icons">thumb_down</span>
            </button>
        `;
        bubbleContainer.appendChild(feedbackDiv);
        await appendMessage('ai', fullResponse, true);
    } catch (error) {
        console.error('Error:', error);
        removeLoading();
        appendMessage('ai', 'An error occurred. Please try again.');
    } finally {
        isProcessing = false;
        setChatInteractionEnabled(true);
    }
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

async function handleFeedback(button, rating, msgIndex) {
    const parent = button.parentElement;
    const currentRating = parent.dataset.currentRating;

    // If clicking the same rating, treat it as a toggle (optional, but here we'll just allow switching)
    if (currentRating === rating) return;

    const aiMsg = currentMessages[msgIndex];
    let userQuery = "N/A";
    for (let i = msgIndex - 1; i >= 0; i--) {
        if (currentMessages[i].role === 'user') {
            userQuery = currentMessages[i].content;
            break;
        }
    }

    if (!aiMsg || aiMsg.role !== 'ai') return;

    const feedbackData = {
        user_id: window.currentUserId || "guest",
        chat_id: currentLoadedChatId,
        message_index: msgIndex,
        user_query: userQuery,
        ai_response: aiMsg.content,
        rating: rating
    };

    try {
        const response = await fetch('/chat/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feedbackData)
        });

        if (response.ok) {
            // Update state
            parent.dataset.currentRating = rating;

            // Reset and update UI
            const allBtns = parent.querySelectorAll('button');
            allBtns.forEach(b => {
                b.classList.remove('is-like', 'is-dislike');
                b.style.opacity = '1';
                b.style.pointerEvents = 'auto';
            });

            // Highlight the active one
            if (rating === 'like') {
                button.classList.add('is-like');
            } else {
                button.classList.add('is-dislike');
            }

            // Quietly update or show a tiny temporary notice
            let notice = parent.querySelector('.feedback-notice');
            if (!notice) {
                notice = document.createElement('span');
                notice.className = 'feedback-notice';
                notice.innerText = 'Updated';
                parent.appendChild(notice);
            }
            notice.classList.add('is-visible');
            setTimeout(() => notice.classList.remove('is-visible'), 1500);
        }
    } catch (error) {
        console.error("Error saving feedback:", error);
    }
}



