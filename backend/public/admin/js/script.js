const API_BASE_URL = 'http://localhost:5000/api/admin';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 1000);
    loadPage('dashboard');
});

// Update current time
function updateTime() {
    const now = new Date();
    document.getElementById('current-time').textContent = now.toLocaleString();
}

// Load page
function loadPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event?.target?.classList.add('active');

    // Show selected page
    const pageId = `${pageName}-page`;
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add('active');
    }

    // Update title
    const titles = {
        dashboard: 'Dashboard',
        users: 'All Users',
        appointments: 'Appointments',
        doctors: 'Doctors',
        health: 'Health Records',
        analytics: 'Analytics',
        system: 'System Health'
    };
    document.getElementById('page-title').textContent = titles[pageName] || 'Dashboard';

    // Load page data
    switch(pageName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'users':
            loadUsers();
            break;
        case 'appointments':
            loadAppointments();
            break;
        case 'doctors':
            loadDoctors();
            break;
        case 'health':
            loadHealthRecords();
            break;
        case 'analytics':
            loadAnalytics();
            break;
        case 'system':
            loadSystemHealth();
            break;
    }
}

// Load Dashboard
async function loadDashboard() {
    try {
        const response = await fetch(`${API_BASE_URL}/stats`);
        const result = await response.json();
        const data = result.data;

        document.getElementById('total-users').textContent = data.totalUsers;
        document.getElementById('user-breakdown').textContent = 
            `${data.patientCount} Patients, ${data.doctorCountByRole} Doctors, ${data.pharmacistCount} Pharmacists`;

        document.getElementById('total-appointments').textContent = data.totalAppointments;
        document.getElementById('appointment-stats').textContent = 
            `✅ ${data.appointmentStats.completed} Completed, ⏳ ${data.appointmentStats.pending} Pending, ❌ ${data.appointmentStats.cancelled} Cancelled`;

        document.getElementById('total-records').textContent = data.totalHealthRecords;
        document.getElementById('total-doctors').textContent = data.doctorCount;
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Load Users
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        const result = await response.json();
        const tbody = document.querySelector('#users-table tbody');
        tbody.innerHTML = '';

        result.data.users.forEach(user => {
            const row = document.createElement('tr');
            const appointmentCount = Object.keys(user.stats || {}).length;
            row.innerHTML = `
                <td>${user.email}</td>
                <td><span class="status-badge" style="background: #c6f6d5; color: #22543d;">${user.role}</span></td>
                <td>${user.registeredAt}</td>
                <td>${appointmentCount}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Load Appointments
async function loadAppointments() {
    try {
        const response = await fetch(`${API_BASE_URL}/appointments`);
        const result = await response.json();
        const tbody = document.querySelector('#appointments-table tbody');
        tbody.innerHTML = '';

        result.data.appointments.forEach(apt => {
            const row = document.createElement('tr');
            const statusClass = `status-${apt.status}`;
            
            let actionsHtml = '';
            if (apt.status === 'pending') {
                actionsHtml = `
                    <button onclick="acceptAppointmentAction(${apt.id})" class="btn-action btn-success">Accept</button>
                    <button onclick="rejectAppointmentAction(${apt.id})" class="btn-action btn-danger margin-l-sm">Reject</button>
                `;
            } else if (apt.status === 'rejected' && apt.rejectionReason) {
                actionsHtml = `<span class="rejection-reason" title="${apt.rejectionReason}">Reason: ${apt.rejectionReason}</span>`;
            } else {
                actionsHtml = '-';
            }

            row.innerHTML = `
                <td>${apt.patientEmail}</td>
                <td>Doctor ${apt.doctorId}</td>
                <td>${apt.appointmentDate}</td>
                <td>${apt.appointmentTime}</td>
                <td><span class="status-badge ${statusClass}">${apt.status}</span></td>
                <td>${apt.symptoms || 'N/A'}</td>
                <td>${actionsHtml}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading appointments:', error);
    }
}

// Load Doctors
async function loadDoctors() {
    try {
        const response = await fetch(`${API_BASE_URL}/doctors`);
        const result = await response.json();
        const tbody = document.querySelector('#doctors-table tbody');
        tbody.innerHTML = '';

        result.data.doctors.forEach(doctor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doctor.id}</td>
                <td>${doctor.name}</td>
                <td>${doctor.specialty}</td>
                <td>${doctor.appointmentCount}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading doctors:', error);
    }
}

// Load Health Records
async function loadHealthRecords() {
    try {
        const response = await fetch(`${API_BASE_URL}/health-records`);
        const result = await response.json();
        const tbody = document.querySelector('#health-table tbody');
        tbody.innerHTML = '';

        result.data.records.forEach(record => {
            const row = document.createElement('tr');
            const medicalInfo = record.medicalInfo || {};
            row.innerHTML = `
                <td>${record.patientEmail}</td>
                <td>${medicalInfo.bloodPressure || 'N/A'}</td>
                <td>${medicalInfo.bloodSugar || 'N/A'}</td>
                <td>${medicalInfo.temperature || 'N/A'}</td>
                <td>${record.prescriptions.length || 0}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading health records:', error);
    }
}

// Load Analytics
async function loadAnalytics() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics`);
        const result = await response.json();
        const data = result.data;

        // Daily Appointments
        const dailyDiv = document.getElementById('daily-appointments');
        dailyDiv.innerHTML = '';
        Object.entries(data.dailyAppointments).forEach(([date, count]) => {
            const item = document.createElement('div');
            item.className = 'analytics-item';
            item.innerHTML = `
                <span class="analytics-label">${date}</span>
                <span class="analytics-value">${count}</span>
            `;
            dailyDiv.appendChild(item);
        });

        // Top Doctors
        const doctorsDiv = document.getElementById('top-doctors');
        doctorsDiv.innerHTML = '';
        Object.entries(data.topDoctors)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .forEach(([doctorId, count]) => {
                const item = document.createElement('div');
                item.className = 'analytics-item';
                item.innerHTML = `
                    <span class="analytics-label">Doctor ${doctorId}</span>
                    <span class="analytics-value">${count}</span>
                `;
                doctorsDiv.appendChild(item);
            });

        // Top Symptoms
        const symptomsDiv = document.getElementById('top-symptoms');
        symptomsDiv.innerHTML = '';
        Object.entries(data.topSymptoms)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .forEach(([symptom, count]) => {
                const item = document.createElement('div');
                item.className = 'analytics-item';
                item.innerHTML = `
                    <span class="analytics-label">${symptom}</span>
                    <span class="analytics-value">${count}</span>
                `;
                symptomsDiv.appendChild(item);
            });
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

// Load System Health
async function loadSystemHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/system-health`);
        const result = await response.json();
        const data = result.data;

        const uptimeSeconds = data.uptime;
        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = Math.floor(uptimeSeconds % 60);

        document.getElementById('uptime').textContent = `${hours}h ${minutes}m ${seconds}s`;
        document.getElementById('heap-used').textContent = data.memory.heapUsed;
        document.getElementById('heap-total').textContent = data.memory.heapTotal;
        document.getElementById('rss-memory').textContent = data.memory.rss;
        document.getElementById('node-version').textContent = data.nodeVersion;
        document.getElementById('platform').textContent = data.platform;
    } catch (error) {
        console.error('Error loading system health:', error);
    }
}

// Set initial active nav item
document.querySelectorAll('.nav-item')[0].classList.add('active');

// Action functions
async function acceptAppointmentAction(id) {
    if(!confirm('Accept this appointment?')) return;
    try {
        const response = await fetch(`${API_BASE_URL}/appointments/${id}/accept`, { method: 'PUT' });
        const result = await response.json();
        if(result.success) loadAppointments();
        else alert('Error: ' + result.error);
    } catch(e) { console.error(e); }
}

async function rejectAppointmentAction(id) {
    const reason = prompt('Please enter rejection reason:');
    if(!reason) return;
    try {
        const response = await fetch(`${API_BASE_URL}/appointments/${id}/reject`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason })
        });
        const result = await response.json();
        if(result.success) loadAppointments();
        else alert('Error: ' + result.error);
    } catch(e) { console.error(e); }
}
