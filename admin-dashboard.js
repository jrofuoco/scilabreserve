    // Admin Dashboard Functions
function loadAdminDashboard() {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    
    // Load reservations pending Admin review
    const pendingAdmin = reservations.filter(r => r.status === 'pending-admin');
    const adminList = document.getElementById('admin-review-list');
    if (adminList) {
        adminList.innerHTML = '';
        
        if (pendingAdmin.length === 0) {
            adminList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No reservations pending admin review.</p>';
        } else {
            pendingAdmin.forEach(res => {
                adminList.appendChild(createReservationItem(res, true));
            });
        }
    }
    
    // Load all reservations
    const allList = document.getElementById('all-reservations-list');
    if (allList) {
        allList.innerHTML = '';
        
        if (reservations.length === 0) {
            allList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No reservations found.</p>';
        } else {
            // Sort by date (newest first)
            const sortedReservations = [...reservations].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            sortedReservations.forEach(res => {
                allList.appendChild(createReservationItem(res, false));
            });
        }
    }
    
    // Update stats
    updateStats(reservations);
    
    // Load teachers
    loadTeachers();
    
    // Load returns
    loadReturns();
    
    // Load room availability
    loadRoomAvailability();
}

function createReservationItem(res, isAdminReview) {
    const div = document.createElement('div');
    div.className = 'reservation-item';
    
    const typeLabel = res.reservationType === 'equipment' ? 'Equipment' : 
                    res.reservationType === 'chemical' ? 'Chemical' :
                    res.reservationType === 'glassware' ? 'Glassware' : 'Lab Room';
    const title = res.reservationType === 'equipment' ? res.equipmentName :
                 res.reservationType === 'chemical' ? res.chemicalName :
                 res.reservationType === 'glassware' ? res.glasswareName :
                 res.lab;
    
    // Build details based on reservation type
    let details = '';
    if (res.reservationType === 'equipment') {
        details = `<p><strong>Quantity:</strong> ${res.equipmentQuantity}</p>`;
    } else if (res.reservationType === 'chemical') {
        details = `<p><strong>Quantity:</strong> ${res.chemicalQuantity}</p>`;
        if (res.safetyNotes) {
            details += `<p><strong>Safety Notes:</strong> ${res.safetyNotes}</p>`;
        }
    } else if (res.reservationType === 'glassware') {
        details = `<p><strong>Quantity:</strong> ${res.glasswareQuantity}</p>`;
    } else if (res.reservationType === 'lab-room') {
        details = `<p><strong>Duration:</strong> ${res.duration} hours</p>`;
        details += `<p><strong>Participants:</strong> ${res.participants}</p>`;
        if (res.equipment && res.equipment !== 'None') {
            details += `<p><strong>Equipment Needed:</strong> ${res.equipment}</p>`;
        }
    }
    
    const statusBadge = getStatusBadge(res.status);
    const actions = isAdminReview && res.status === 'pending-admin'
        ? `<button class="secondary" onclick="adminApprove(${res.id})">Approve</button>
           <button class="secondary" onclick="adminReject(${res.id})">Reject</button>`
        : '';
    
    div.innerHTML = `
        <div class="reservation-info">
            <h4>${typeLabel}: ${title}</h4>
            <p><strong>User:</strong> ${res.username} (${res.userType})</p>
            ${res.adviserName ? `<p><strong>Approved by Adviser:</strong> ${res.adviserName}</p>` : ''}
            <p><strong>Date:</strong> ${new Date(res.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${res.time}</p>
            <p><strong>Purpose:</strong> ${res.purpose}</p>
            ${details}
            ${res.rejectionReason ? `<p style="color: #721c24; margin-top: 0.5rem;"><strong>Rejection Reason:</strong> ${res.rejectionReason}</p>` : ''}
            ${res.adminApprovedAt ? `<p style="color: #155724; margin-top: 0.5rem;"><strong>Approved by:</strong> ${res.adminName || 'Admin'} on ${new Date(res.adminApprovedAt).toLocaleDateString()}</p>` : ''}
            ${(res.reservationType === 'equipment' || res.reservationType === 'chemical') && res.returnStatus === 'returned' 
                ? `<p style="color: #0c5460; margin-top: 0.5rem;"><strong>Returned:</strong> ${res.returnedBy || 'Admin'} on ${new Date(res.returnedAt).toLocaleDateString()}</p>` 
                : ''
            }
        </div>
        <div class="reservation-actions">
            ${statusBadge}
            ${actions}
        </div>
    `;
    
    return div;
}

function getStatusBadge(status) {
    const badges = {
        'pending-adviser': '<span class="badge pending">Pending Adviser Review</span>',
        'pending-admin': '<span class="badge pending-admin">Pending Admin Review</span>',
        'approved': '<span class="badge approved">Approved</span>',
        'rejected': '<span class="badge rejected">Rejected</span>',
        'returned': '<span class="badge returned">Returned</span>',
        'pending-return': '<span class="badge pending-return">Pending Return</span>'
    };
    return badges[status] || '<span class="badge pending">Pending</span>';
}

function updateStats(reservations) {
    const total = reservations.length;
    const pendingAdmin = reservations.filter(r => r.status === 'pending-admin').length;
    const approved = reservations.filter(r => r.status === 'approved').length;
    const rejected = reservations.filter(r => r.status === 'rejected').length;
    
    const statCards = document.querySelectorAll('.stat-card h3');
    if (statCards.length >= 4) {
        statCards[0].textContent = total;
        statCards[1].textContent = pendingAdmin;
        statCards[2].textContent = approved;
        statCards[3].textContent = rejected;
    }
}

// Teacher Management Functions
async function loadTeachers() {
    const teachersList = document.getElementById('teachers-list');
    if (!teachersList) {
        return;
    }
    
    teachersList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Loading teachers...</p>';
    
    try {
        const response = await fetch('list_teachers.php');
        const result = await response.json();
        
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Unable to load teachers.');
        }
        
        const teachers = result.teachers || [];
        
        if (teachers.length === 0) {
            teachersList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No teachers found.</p>';
            return;
        }
        
        teachersList.innerHTML = '';
        teachers.forEach(teacher => {
            teachersList.appendChild(createTeacherItem(teacher));
        });
    } catch (error) {
        teachersList.innerHTML = `<p style="text-align: center; color: #b71c1c; padding: 2rem;">${error.message || 'Failed to load teachers.'}</p>`;
    }
}

function createTeacherItem(teacher) {
    const div = document.createElement('div');
    div.className = 'teacher-item';
    
    div.innerHTML = `
        <div class="teacher-info">
            <h4>${teacher.name}</h4>
            <p><strong>Username:</strong> ${teacher.username}</p>
            <p><strong>Email:</strong> ${teacher.email}</p>
        </div>
        <div class="reservation-actions">
            <button class="danger" onclick="deleteTeacher('${teacher.username}')">Delete</button>
        </div>
    `;
    
    return div;
}

async function addTeacher(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const username = formData.get('username');
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Validation
    if (!username || !firstName || !lastName || !email || !password) {
        alert('Please fill in all fields.');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }
    
    const payload = {
        username: username.trim(),
        name: `${firstName} ${lastName}`.trim(),
        email: email.trim(),
        password
    };
    
    try {
        const response = await fetch('admin_add_teacher.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Failed to add teacher.');
        }
        
        alert(`Teacher "${payload.name}" has been added successfully!`);
        form.reset();
        loadTeachers();
    } catch (error) {
        alert(error.message || 'Unable to add teacher. Please try again.');
    }
}

async function deleteTeacher(username) {
    if (!confirm('Are you sure you want to delete this teacher? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch('delete_teacher.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });
        
        const result = await response.json();
        
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Failed to delete teacher.');
        }
        
        alert('Teacher has been deleted successfully.');
        loadTeachers();
    } catch (error) {
        alert(error.message || 'Unable to delete teacher. Please try again.');
    }
}

// Return Confirmation Functions
function loadReturns() {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    // Show equipment, chemical, and glassware reservations that have been confirmed as returned
    const returnedResources = reservations.filter(r => 
        (r.reservationType === 'equipment' || r.reservationType === 'chemical' || r.reservationType === 'glassware') &&
        r.returnStatus === 'returned'
    );
    
    const returnsList = document.getElementById('returns-list');
    if (returnsList) {
        returnsList.innerHTML = '';
        
        if (returnedResources.length === 0) {
            returnsList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No resources have been returned yet.</p>';
        } else {
            returnedResources.forEach(res => {
                returnsList.appendChild(createReturnItem(res));
            });
        }
    }
}

function createReturnItem(res) {
    const div = document.createElement('div');
    div.className = 'reservation-item';
    
    const typeLabel = res.reservationType === 'equipment' ? 'Equipment' : 
                    res.reservationType === 'chemical' ? 'Chemical' : 'Glassware';
    const title = res.reservationType === 'equipment' ? res.equipmentName :
                 res.reservationType === 'chemical' ? res.chemicalName : res.glasswareName;
    const quantity = res.reservationType === 'equipment' ? res.equipmentQuantity :
                    res.reservationType === 'chemical' ? res.chemicalQuantity : res.glasswareQuantity;
    
    div.innerHTML = `
        <div class="reservation-info">
            <h4>${typeLabel}: ${title}</h4>
            <p><strong>User:</strong> ${res.username} (${res.userType})</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Borrowed Date:</strong> ${new Date(res.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${res.time}</p>
            <p><strong>Returned Date:</strong> ${res.returnedAt ? new Date(res.returnedAt).toLocaleDateString() : 'Not recorded'}</p>
            <p><strong>Confirmed By:</strong> ${res.returnedBy || 'Admin'}</p>
        </div>
        <div class="reservation-actions">
            <span class="badge returned">Returned</span>
            ${res.reservationType === 'glassware' ? '<p style="color: #666; font-size: 0.85rem; margin-top: 0.5rem;"><em>Glassware items</em></p>' : ''}
        </div>
    `;
    
    return div;
}

function confirmReturn(reservationId) {
    if (!confirm('Confirm that the equipment/chemical has been returned in good condition?')) {
        return;
    }
    
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const res = reservations.find(r => r.id === reservationId);
    
    if (res) {
        res.returnStatus = 'returned';
        res.returnedAt = new Date().toISOString();
        res.returnedBy = sessionStorage.getItem('username') || 'Admin';
        localStorage.setItem('reservations', JSON.stringify(reservations));
        alert('Return confirmed successfully!');
        loadReturns();
        loadAdminDashboard(); // Refresh the dashboard
    }
}

// Room Availability Functions
function loadRoomAvailability() {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const rooms = ['Lecture Room', 'Chemistry Laboratory', 'Biology Laboratory', 'Physics Laboratory'];
    const today = new Date().toISOString().split('T')[0];
    
    // Get today's approved reservations for rooms
    const todayReservations = reservations.filter(r => 
        r.status === 'approved' && 
        r.reservationType === 'lab-room' &&
        r.date === today
    );
    
    const roomAvailability = document.getElementById('room-availability');
    if (roomAvailability) {
        roomAvailability.innerHTML = '';
        
        rooms.forEach(room => {
            const roomReservations = todayReservations.filter(r => r.lab === room);
            const isOccupied = roomReservations.some(r => {
                const now = new Date();
                const timeSlot = r.time.split(' - ');
                const startTime = timeSlot[0];
                const endTime = timeSlot[1];
                const currentTime = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
                return currentTime >= startTime && currentTime <= endTime;
            });
            
            const hasReservation = roomReservations.length > 0;
            const status = isOccupied ? 'occupied' : (hasReservation ? 'reserved' : 'available');
            const statusText = isOccupied ? 'Occupied' : (hasReservation ? 'Reserved' : 'Available');
            
            const roomCard = document.createElement('div');
            roomCard.className = 'room-card';
            roomCard.innerHTML = `
                <h4>${room}</h4>
                <div class="room-status">
                    <span class="status-indicator ${status}"></span>
                    <span>${statusText}</span>
                </div>
                ${hasReservation ? `<p style="margin-top: 0.5rem; font-size: 0.85rem; color: #666;">${roomReservations.length} reservation(s) today</p>` : ''}
            `;
            roomAvailability.appendChild(roomCard);
        });
    }
}

// Load dashboard on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadAdminDashboard();
        // Set up add teacher form
        setupTeacherForm();
    });
} else {
    loadAdminDashboard();
    setupTeacherForm();
}

function setupTeacherForm() {
    const addTeacherForm = document.getElementById('add-teacher-form');
    if (addTeacherForm) {
        addTeacherForm.addEventListener('submit', addTeacher);
    }
}

