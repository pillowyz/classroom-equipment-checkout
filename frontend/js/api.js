// API Base URL - Change this to your backend URL
const API_URL = 'http://localhost/classroom-equipment-checkout/backend/api';

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    // Get token from localStorage if exists
    const token = localStorage.getItem('authToken');
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add body for POST requests
    if (data && method === 'POST') {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_URL}/${endpoint}`, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Something went wrong');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Show message to user
function showMessage(message, type = 'success') {
    const messageEl = document.getElementById('message');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        messageEl.classList.remove('hidden');
        
        setTimeout(() => {
            messageEl.classList.add('hidden');
        }, 5000);
    }
}