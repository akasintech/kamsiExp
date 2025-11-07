const API_BASE_URL = 'http://localhost:3000/api';

// Auth helpers
const TOKEN_KEY = 'admin_token';
const TOKEN_EXPIRY_KEY = 'admin_token_expiry';
const TOKEN_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function getToken() {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (expiry && Date.now() > parseInt(expiry)) {
        // Token expired, clean up
        logout();
        return null;
    }
    return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
    const expiryTime = Date.now() + TOKEN_DURATION;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
}

function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    window.location.href = 'login.html';
}

function authHeaders(extra = {}) {
    const token = getToken();
    return {
        ...(extra || {}),
        'Authorization': token ? `Bearer ${token}` : '',
    };
}

function handleUnauthorized(error) {
    if (error.message && error.message.toLowerCase().includes('unauthorized')) {
        logout();
        return true;
    }
    // Also check if error has a response with 401 status
    if (error.response && error.response.status === 401) {
        logout();
        return true;
    }
    return false;
}

// DOM Elements
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const recordsContainer = document.getElementById('recordsContainer');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const refreshBtn = document.getElementById('refreshBtn');

// Forms
const addTrackingForm = document.getElementById('addTrackingForm');
const editTrackingForm = document.getElementById('editTrackingForm');

// Modals
const deleteModal = document.getElementById('deleteModal');
const editModal = document.getElementById('editModal');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const closeEditModal = document.getElementById('closeEditModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const deleteTrackingIdDisplay = document.getElementById('deleteTrackingId');
const editTrackingIdDisplay = document.getElementById('editTrackingIdDisplay');

// State
let currentDeleteTrackingId = null;

// Tab Switching
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// Fetch and Display All Records
async function fetchAllRecords() {
    loading.style.display = 'block';
    errorMessage.style.display = 'none';
    recordsContainer.innerHTML = '';

    try {
        const response = await fetch(`${API_BASE_URL}/tracking-records`, { headers: authHeaders() });
        const result = await response.json();

        if (!response.ok) {
            if (response.status === 401 || result.message?.toLowerCase().includes('unauthorized')) {
                logout();
                return;
            }
            throw new Error(result.message || 'Failed to fetch records');
        }

        loading.style.display = 'none';

        if (!result.data || result.data.length === 0) {
            recordsContainer.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <h3>No Tracking Records Found</h3>
                    <p>Start by adding a new tracking record using the "Add Tracking ID" tab.</p>
                </div>
            `;
            return;
        }

        result.data.forEach(record => {
            const recordCard = createRecordCard(record);
            recordsContainer.appendChild(recordCard);
        });
    } catch (error) {
        loading.style.display = 'none';
        if (handleUnauthorized(error)) return;
        errorMessage.style.display = 'block';
        errorMessage.textContent = `Error: ${error.message}`;
        console.error('Error fetching records:', error);
    }
}

// Create Record Card
function createRecordCard(record) {
    const card = document.createElement('div');
    card.className = 'record-card';

    const statusClass = `status-${record.status}`;
    
    card.innerHTML = `
        <div class="record-header">
            <div class="tracking-id">${record.trackingId.toUpperCase()} <i class='fa fa-copy' onclick="copyTrackingId('${record.trackingId}')"></i></div>
            <span class="status-badge ${statusClass}">${formatStatus(record.status)}</span>
        </div>
        <div class="record-info">
            <div class="info-row">
                <span class="info-label">Sender:</span>
                <span class="info-value">${record.senderName}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Receiver:</span>
                <span class="info-value">${record.receiverName}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Package:</span>
                <span class="info-value">${truncateText(record.packageDesc, 30)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Dispatch:</span>
                <span class="info-value">${formatDate(record.dispatchDate)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Estimated Arrival:</span>
                <span class="info-value">${formatDate(record.estimatedArrivalDate)}</span>
            </div>
        </div>
        <div class="record-actions">
            <button class="btn btn-edit" onclick="openEditModal('${record.trackingId}')">
                Edit
            </button>
            <button class="btn btn-delete" onclick="openDeleteModal('${record.trackingId}')">
                Delete
            </button>
        </div>
    `;

    return card;
}

// Format Status
function formatStatus(status) {
    return status.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Truncate Text
function truncateText(text, maxLength) {
    if (!text) return 'N/A';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Format Date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Copy Tracking ID
function copyTrackingId(trackingId) {
    navigator.clipboard.writeText(trackingId);
    showToast('Tracking ID copied to clipboard!', 'success');
}

// Open Delete Modal
function openDeleteModal(trackingId) {
    currentDeleteTrackingId = trackingId;
    deleteTrackingIdDisplay.textContent = trackingId;
    deleteModal.classList.add('active');
}

// Close Delete Modal
function closeDeleteModalFunc() {
    deleteModal.classList.remove('active');
    currentDeleteTrackingId = null;
}

closeDeleteModal.addEventListener('click', closeDeleteModalFunc);
cancelDeleteBtn.addEventListener('click', closeDeleteModalFunc);

// Confirm Delete
confirmDeleteBtn.addEventListener('click', async () => {
    if (!currentDeleteTrackingId) return;

    try {
        const response = await fetch(`${API_BASE_URL}/delete/${currentDeleteTrackingId}`, {
            method: 'DELETE',
            headers: authHeaders()
        });

        const result = await response.json();

        if (!response.ok) {
            if (response.status === 401 || result.message?.toLowerCase().includes('unauthorized')) {
                logout();
                return;
            }
            throw new Error(result.message || 'Failed to delete record');
        }

        showToast('Record deleted successfully!', 'success');
        closeDeleteModalFunc();
        fetchAllRecords();
    } catch (error) {
        if (handleUnauthorized(error)) return;
        showToast(`Error: ${error.message}`, 'error');
        console.error('Error deleting record:', error);
    }
});

// Open Edit Modal
async function openEditModal(trackingId) {
    try {
        const response = await fetch(`${API_BASE_URL}/track/${trackingId}`);
        const result = await response.json();

        if (!response.ok) {
            if (response.status === 401 || result.message?.toLowerCase().includes('unauthorized')) {
                logout();
                return;
            }
            throw new Error(result.message || 'Failed to fetch record');
        }

        const record = result.data;

        // Populate form fields
        editTrackingIdDisplay.textContent = record.trackingId;
        document.getElementById('editTrackingId').value = record.trackingId;
        document.getElementById('editSenderName').value = record.senderName || '';
        document.getElementById('editSenderEmail').value = record.senderEmail || '';
        document.getElementById('editSenderContact').value = record.senderContact || '';
        document.getElementById('editSenderAddress').value = record.senderAddress || '';
        document.getElementById('editReceiverName').value = record.receiverName || '';
        document.getElementById('editReceiverEmail').value = record.receiverEmail || '';
        document.getElementById('editReceiverContact').value = record.receiverContact || '';
        document.getElementById('editReceiverAddress').value = record.receiverAddress || '';
        document.getElementById('editPackageDesc').value = record.packageDesc || '';
        document.getElementById('editDispatchLocation').value = record.dispatchLocation || '';
        document.getElementById('editStatus').value = record.status || 'pending';
        
        // Format dates for input fields (YYYY-MM-DD)
        if (record.dispatchDate) {
            const dispatchDate = new Date(record.dispatchDate);
            document.getElementById('editDispatchDate').value = dispatchDate.toISOString().split('T')[0];
        }
        if (record.estimatedArrivalDate) {
            const arrivalDate = new Date(record.estimatedArrivalDate);
            document.getElementById('editEstimatedArrivalDate').value = arrivalDate.toISOString().split('T')[0];
        }

        editModal.classList.add('active');
    } catch (error) {
        if (handleUnauthorized(error)) return;
        showToast(`Error: ${error.message}`, 'error');
        console.error('Error fetching record for edit:', error);
    }
}

// Close Edit Modal
function closeEditModalFunc() {
    editModal.classList.remove('active');
    editTrackingForm.reset();
}

closeEditModal.addEventListener('click', closeEditModalFunc);
cancelEditBtn.addEventListener('click', closeEditModalFunc);

// Submit Edit Form
editTrackingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

    const formData = new FormData(editTrackingForm);
    const trackingId = formData.get('trackingId');
    
    // Remove trackingId from update data (it shouldn't be updated)
    const updateData = {};
    for (const [key, value] of formData.entries()) {
        if (key !== 'trackingId') {
            updateData[key] = value;
        }
    }

    try {
        const response = await fetch(`${API_BASE_URL}/update/${trackingId}`, {
            method: 'PUT',
            headers: authHeaders({'Content-Type': 'application/json'}),
            body: JSON.stringify(updateData)
        });

        const result = await response.json();

        if (!response.ok) {
            if (response.status === 401 || result.message?.toLowerCase().includes('unauthorized')) {
                logout();
                return;
            }
            throw new Error(result.message || 'Failed to update record');
        }

        showToast('Record updated successfully!', 'success');
        closeEditModalFunc();
        fetchAllRecords();
    } catch (error) {
        if (handleUnauthorized(error)) return;
        showToast(`Error: ${error.message}`, 'error');
        console.error('Error updating record:', error);
    }
});

// Submit Add Tracking Form
addTrackingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

    const formData = new FormData(addTrackingForm);
      const data = Object.fromEntries(formData);

    try {
        const response = await fetch(`${API_BASE_URL}/add-tracking-id`, {
            method: 'POST',
            headers: authHeaders({'Content-Type': 'application/json'}),
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            if (response.status === 401 || result.message?.toLowerCase().includes('unauthorized')) {
                logout();
                return;
            }
            throw new Error(result.message || 'Failed to add tracking record');
        }

        showToast(`Tracking record added successfully! ID: ${result.trackingId}`, 'success');
        addTrackingForm.reset();
        
        // Switch to dashboard tab and refresh
        document.querySelector('[data-tab="dashboard"]').click();
        setTimeout(() => fetchAllRecords(), 300);
    } catch (error) {
        if (handleUnauthorized(error)) return;
        showToast(`Error: ${error.message}`, 'error');
        console.error('Error adding tracking record:', error);
    }
});

// Refresh Button
refreshBtn.addEventListener('click', () => {
    fetchAllRecords();
    showToast('Refreshing records...', 'success');
});

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Close modals when clicking outside
deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        closeDeleteModalFunc();
    }
});

editModal.addEventListener('click', (e) => {
    if (e.target === editModal) {
        closeEditModalFunc();
    }
});

// Initialize: Fetch records on page load
document.addEventListener('DOMContentLoaded', () => {
    if (!getToken()) {
        window.location.href = 'login.html';
        return;
    }
    fetchAllRecords();
  });
