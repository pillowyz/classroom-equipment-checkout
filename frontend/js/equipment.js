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
    console.log('Logout clicked');
    
    if (confirm('Are you sure you want to logout?')) {
        console.log('Logging out...');
        
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('studentId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('tempEmail');
        
        showMessage('Logged out successfully', 'success');
        
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
    
    tbody.innerHTML = equipment.map(item => {
        // Convert status to CSS-friendly class name
        const statusClass = item.status.toLowerCase().replace(/\s+/g, '-');
        
        return `
            <tr>
                <td>${item.device_name}</td>
                <td>${item.device_type}</td>
                <td><span class="status status-${statusClass}">${item.status}</span></td>
                <td>${item.last_checked_out ? new Date(item.last_checked_out).toLocaleString() : 'Never'}</td>
            </tr>
        `;
    }).join('');
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
    const studentId = localStorage.getItem('studentId');
    
    if (!deviceId) {
        showMessage('Please select equipment', 'error');
        return;
    }
    
    if (!studentId) {
        showMessage('Student ID not found. Please login again.', 'error');
        return;
    }
    
    console.log('Checking out device:', deviceId, 'for student:', studentId);
    
    try {
        const result = await apiCall('checkout.php', 'POST', {
            device_id: deviceId,
            student_id: studentId
        });
        
        if (result.success) {
            showMessage(result.message, 'success');
            document.getElementById('equipment-select').value = '';
            loadEquipment();
        }
    } catch (error) {
        console.error('Checkout error:', error);
        showMessage(error.message, 'error');
    }
}

// Load my items
async function loadMyItems() {
    const studentId = localStorage.getItem('studentId');
    const tbody = document.getElementById('my-items-list');
    
    console.log('Loading items for student:', studentId);
    
    if (!studentId) {
        tbody.innerHTML = '<tr><td colspan="4" class="loading">Please login to view your items</td></tr>';
        return;
    }
    
    try {
        const result = await apiCall(`get-my-transactions.php?student_id=${studentId}`);
        
        console.log('Transactions result:', result);
        
        if (result.success && result.data) {
            displayMyItems(result.data);
        }
    } catch (error) {
        console.error('Failed to load transactions:', error);
        tbody.innerHTML = '<tr><td colspan="4" class="loading">Failed to load your items</td></tr>';
    }
}

// Display my items
function displayMyItems(transactions) {
    const tbody = document.getElementById('my-items-list');
    
    console.log('Displaying transactions:', transactions);
    
    // Filter only active (not returned) transactions
    const activeTransactions = transactions.filter(t => t.actual_return_date === null);
    
    console.log('Active transactions:', activeTransactions);
    
    if (activeTransactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="loading">No items currently checked out</td></tr>';
        return;
    }
    
    tbody.innerHTML = activeTransactions.map(item => `
        <tr>
            <td>${item.device_name}</td>
            <td>${item.device_type}</td>
            <td>${new Date(item.checkout_date).toLocaleDateString()}</td>
            <td>
                <button onclick="returnEquipment(${item.transaction_id})" class="btn btn-success btn-small">
                    Return
                </button>
            </td>
        </tr>
    `).join('');
}

// Return equipment - FIXED VERSION
async function returnEquipment(transactionId) {
    console.log('Return button clicked for transaction:', transactionId);
    
    if (!confirm('Are you sure you want to return this equipment?')) {
        console.log('Return cancelled by user');
        return;
    }
    
    console.log('Proceeding with return...');
    
    try {
        const result = await apiCall('return.php', 'POST', {
            transaction_id: transactionId
        });
        
        console.log('Return result:', result);
        
        if (result.success) {
            showMessage(result.message, 'success');
            // Reload both tabs to show updated status
            loadMyItems();
            loadEquipment();
        } else {
            showMessage(result.message || 'Failed to return equipment', 'error');
        }
    } catch (error) {
        console.error('Return error:', error);
        showMessage('Failed to return equipment: ' + error.message, 'error');
    }
}

// Show tabs
function showTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
    
    if (tabName === 'browse') {
        loadEquipment();
    } else if (tabName === 'my-items') {
        loadMyItems();
    }
}