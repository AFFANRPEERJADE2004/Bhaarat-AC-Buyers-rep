// Admin Panel Functions
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123' // Change this in production!
};

// Check if already logged in
document.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        showDashboard();
    }
});

function adminLogin() {
    const username = document.getElementById('username')?.value;
    const password = document.getElementById('password')?.value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        showDashboard();
        loadSubmissions();
    } else {
        alert('Invalid credentials!');
    }
}

function showDashboard() {
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    
    if (loginSection) loginSection.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'block';
    
    loadSubmissions();
}

function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    location.reload();
}

function loadSubmissions() {
    const submissions = JSON.parse(localStorage.getItem('acSubmissions') || '[]');
    
    // Update stats
    updateStats(submissions);
    
    // Load table
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) return;
    
    if (submissions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No submissions yet</td></tr>';
        return;
    }
    
    let html = '';
    submissions.reverse().forEach(sub => {
        html += `
            <tr>
                <td>${sub.id}</td>
                <td>${sub.fullName || ''}</td>
                <td>
                    ${sub.mobile || ''}<br>
                    <a href="https://wa.me/91${sub.mobile}" target="_blank" style="color: #25D366;">WhatsApp</a>
                </td>
                <td>${sub.area || ''}</td>
                <td>
                    <strong>${sub.brand || ''} ${sub.acType || ''}</strong><br>
                    ${sub.capacity || ''} Ton, ${sub.age || ''}<br>
                    Condition: ${sub.condition || ''}
                </td>
                <td>
                    <span class="status-badge status-pending">Pending</span>
                </td>
                <td>
                    <button class="action-btn" onclick="updateStatus(${sub.id}, 'contacted')" style="background: #cce5ff;">Contacted</button>
                    <button class="action-btn" onclick="updateStatus(${sub.id}, 'completed')" style="background: #d4edda;">Complete</button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

function updateStats(submissions) {
    const statsContainer = document.getElementById('statsContainer');
    if (!statsContainer) return;
    
    const total = submissions.length;
    const today = submissions.filter(s => {
        const subDate = new Date(s.submittedAt).toDateString();
        const todayDate = new Date().toDateString();
        return subDate === todayDate;
    }).length;
    
    statsContainer.innerHTML = `
        <div class="stat-card">
            <div class="stat-number">${total}</div>
            <div>Total Listings</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${today}</div>
            <div>Today's Listings</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${submissions.filter(s => s.condition === 'Working Perfectly').length}</div>
            <div>Working ACs</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${submissions.filter(s => s.condition === 'Not Working').length}</div>
            <div>Non-Working ACs</div>
        </div>
    `;
}

function updateStatus(id, status) {
    const submissions = JSON.parse(localStorage.getItem('acSubmissions') || '[]');
    // Update status logic here
    alert(`Status updated to ${status} for listing #${id}`);
}

// Export data
function exportData() {
    const submissions = JSON.parse(localStorage.getItem('acSubmissions') || '[]');
    const dataStr = JSON.stringify(submissions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ac-submissions-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}