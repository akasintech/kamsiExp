const API_BASE_URL = 'http://localhost:3000/api';
const TOKEN_KEY = 'admin_token';
const TOKEN_EXPIRY_KEY = 'admin_token_expiry';
const TOKEN_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const form = document.getElementById('loginForm');

function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
    const expiryTime = Date.now() + TOKEN_DURATION;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
}

function getToken() {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (expiry && Date.now() > parseInt(expiry)) {
        // Token expired, clean up
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
        return null;
    }
    return localStorage.getItem(TOKEN_KEY);
}

function showToast(message, type = 'error') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const loadingSpinner = document.querySelector('.loading-spinner');
  loadingSpinner.style.display = 'inline-block';
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData);

  try {
    const res = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Login failed');
    setToken(result.token);
    window.location.href = 'admin.html';
  } catch (err) {
    showToast(err.message || 'Login failed', 'error');
  } finally {
    loadingSpinner.style.display = 'none';
  }
});

// If already logged in with valid token, go to admin
if (getToken()) {
  window.location.href = 'admin.html';
}


