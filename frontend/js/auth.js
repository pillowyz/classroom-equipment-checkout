// Login function
async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    console.log('Login attempt with:', email); // Debug log
    
    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    try {
        const result = await apiCall('login.php', 'POST', { email, password });
        
        console.log('Login result:', result); // Debug log
        
        if (result.success) {
            // Store email for 2FA
            localStorage.setItem('tempEmail', email);
            
            // Show 2FA form
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('twofa-form').classList.remove('hidden');
            
            showMessage(result.message, 'success');
        }
    } catch (error) {
        console.error('Login error:', error); // Debug log
        showMessage(error.message, 'error');
    }
}

// Verify 2FA
async function verify2FA() {
    const code = document.getElementById('twofa-code').value;
    const email = localStorage.getItem('tempEmail');
    
    console.log('2FA verification attempt:', { code, email }); // Debug log
    
    if (!code || code.length !== 6) {
        showMessage('Please enter a valid 6-digit code', 'error');
        return;
    }
    
    try {
        const result = await apiCall('verify-2fa.php', 'POST', { email, code });
        
        console.log('2FA result:', result); // Debug log
        
        if (result.success) {
            console.log('Login successful, storing token and redirecting...'); // Debug log
            
            // Store auth token
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('userName', result.user.name);
            localStorage.removeItem('tempEmail');
            
            console.log('Stored data:', {
                token: localStorage.getItem('authToken'),
                userName: localStorage.getItem('userName')
            }); // Debug log
            
            // Show success message briefly before redirect
            showMessage('Login successful! Redirecting...', 'success');
            
            // Redirect to dashboard after short delay
            setTimeout(() => {
                console.log('Redirecting to dashboard...'); // Debug log
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('2FA error:', error); // Debug log
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

// Logout
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
}

// Check if user is logged in (for dashboard page)
function checkAuth() {
    const token = localStorage.getItem('authToken');
    console.log('Checking auth, token:', token); // Debug log
    
    if (!token) {
        console.log('No token found, redirecting to login'); // Debug log
        window.location.href = 'index.html';
        return false;
    }
    return true;
}