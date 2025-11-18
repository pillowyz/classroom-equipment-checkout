// Login function
async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    console.log('Login attempt with:', email);
    
    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    try {
        const result = await apiCall('login.php', 'POST', { email, password });
        
        console.log('Login result:', result);
        
        if (result.success) {
            localStorage.setItem('tempEmail', email);
            
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('twofa-form').classList.remove('hidden');
            
            showMessage(result.message, 'success');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage(error.message, 'error');
    }
}

// Verify 2FA
async function verify2FA() {
    const code = document.getElementById('twofa-code').value;
    const email = localStorage.getItem('tempEmail');
    
    console.log('2FA verification attempt:', { code, email });
    
    if (!code || code.length !== 6) {
        showMessage('Please enter a valid 6-digit code', 'error');
        return;
    }
    
    try {
        const result = await apiCall('verify-2fa.php', 'POST', { email, code });
        
        console.log('2FA result:', result);
        
        if (result.success) {
            console.log('Login successful, storing data...');
            
            // Store auth token and user info
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('userName', result.user.name);
            localStorage.setItem('studentId', result.user.id);
            localStorage.setItem('userEmail', result.user.email);
            localStorage.removeItem('tempEmail');
            
            showMessage('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('2FA error:', error);
        showMessage(error.message, 'error');
    }
}

// Back to login
function backToLogin() {
    document.getElementById('twofa-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('twofa-code').value = '';
    localStorage.removeItem('tempEmail');
}

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('authToken');
    console.log('Checking auth, token:', token);
    
    if (!token) {
        console.log('No token found, redirecting to login');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}