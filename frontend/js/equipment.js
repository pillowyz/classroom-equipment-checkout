// Check auth on page load
if (window.location.pathname.includes('dashboard.html')) {
    checkAuth();
    loadEquipment();
    displayUserName();
}

// Display user name
function displayUserName() {
    const userName = localStorage.getItem('userName');
    if (userName) {
        document.getElementById('user-name').textContent = `Welcome, ${userName}`;
    }
}

// Logout handler
function handleLogout() {
    console.log('Logout clicked'); // Debug log
    
    // Confirm logout
    if (confirm('Are you sure you want to logout?')) {
        console.log('Logging out...'); // Debug log
        
        // Clear all stored data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('tempEmail');
        
        // Show message
        showMessage('Logged out successfully', 'success');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    }
}

// Load equipment
async function loadEquipment() {
    try {
        const result = await apiCall('get-equipment.php');
        
        if (result.success) {
            displayEquipment(result.data);
            populateEquipmentSelect(result.data);
        }
    } catch (error) {
        console.error('Failed to load equipment:', error);
        showMessage('Failed to load equipment', 'error');
    }
}

// Display equipment in table
function displayEquipment(equipment) {
    const tbody = document.getElementById('equipment-list');
    
    if (equipment.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="loading">No equipment available</td></tr>';
        return;
    }
    
    tbody.innerHTML = equipment.map(item => `
        <tr>
            <td>${item.device_name}</td>
            <td>${item.device_type}</td>
            <td><span class="status status-${item.status.toLowerCase()}">${item.status}</span></td>
            <td>${item.last_checked_out || 'Never'}</td>
        </tr>
    `).join('');
}

// Populate equipment select dropdown
function populateEquipmentSelect(equipment) {
    const select = document.getElementById('equipment-select');
    const available = equipment.filter(item => item.status === 'Available');
    
    select.innerHTML = '<option value="">-- Select Equipment --</option>' +
        available.map(item => `
            <option value="${item.device_id}">${item.device_name} (${item.device_type})</option>
        `).join('');
}

// Checkout equipment
async function checkoutEquipment() {
    const deviceId = document.getElementById('equipment-select').value;
    const studentName = document.getElementById('student-name').value;
    
    if (!deviceId || !studentName) {
        showMessage('Please select equipment and enter your name', 'error');
        return;
    }
    
    try {
        const result = await apiCall('checkout.php', 'POST', {
            device_id: deviceId,
            student_name: studentName
        });
        
        if (result.success) {
            showMessage(result.message, 'success');
            document.getElementById('equipment-select').value = '';
            document.getElementById('student-name').value = '';
            loadEquipment();
        }
    } catch (error) {
        console.error('Checkout error:', error);
        showMessage(error.message, 'error');
    }
}

// Show tabs
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
    
    // Load data if needed
    if (tabName === 'browse') {
        loadEquipment();
    } else if (tabName === 'my-items') {
        loadMyItems();
    }
}

// Load my items (placeholder - you'll need to implement tracking)
async function loadMyItems() {
    const tbody = document.getElementById('my-items-list');
    tbody.innerHTML = '<tr><td colspan="4" class="loading">Feature coming soon...</td></tr>';
}