// Teacher Dashboard Functions
function loadTeacherDashboard() {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const username = sessionStorage.getItem('username');
    
    // Load teacher's own reservations
    const myReservations = reservations.filter(r => r.userType === 'teacher' && r.username === username);
    const myList = document.getElementById('my-reservations-list');
    if (myList) {
        myList.innerHTML = '';
        
        if (myReservations.length === 0) {
            myList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No reservations found.</p>';
        } else {
            myReservations.forEach(res => {
                myList.appendChild(createReservationItem(res, false));
            });
        }
    }
    
    // Load student reservations pending Adviser review
    const pendingAdviser = reservations.filter(r => r.userType === 'student' && r.status === 'pending-adviser');
    const adviserList = document.getElementById('adviser-review-list');
    if (adviserList) {
        adviserList.innerHTML = '';
        
        if (pendingAdviser.length === 0) {
            adviserList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No student requests pending Adviser review.</p>';
        } else {
            pendingAdviser.forEach(res => {
                adviserList.appendChild(createReservationItem(res, true));
            });
        }
    }
    
    // Update stats
    updateStats(reservations);
    
    // Load room availability
    loadRoomAvailability();
}

function createReservationItem(res, isAdviserReview) {
    const div = document.createElement('div');
    div.className = 'reservation-item';
    
    const typeLabel = res.reservationType === 'equipment' ? 'Equipment' : 
                    res.reservationType === 'chemical' ? 'Chemical' :
                    res.reservationType === 'glassware' ? 'Glassware' : 'Lab Room';
    const title = res.reservationType === 'equipment' ? res.equipmentName :
                 res.reservationType === 'chemical' ? res.chemicalName :
                 res.reservationType === 'glassware' ? res.glasswareName :
                 res.lab;
    
    const statusBadge = getStatusBadge(res.status);
    const actions = isAdviserReview && res.status === 'pending-adviser'
        ? `<button class="secondary" onclick="approveReservation(${res.id})">Approve</button>
           <button class="secondary" onclick="rejectReservation(${res.id})">Reject</button>`
        : '';
    
    div.innerHTML = `
        <div class="reservation-info">
            <h4>${typeLabel}: ${title}</h4>
            ${res.userType === 'student' ? `<p><strong>Student:</strong> ${res.username}</p>` : ''}
            <p><strong>Date:</strong> ${new Date(res.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${res.time}</p>
            <p><strong>Purpose:</strong> ${res.purpose}</p>
            ${res.rejectionReason ? `<p style="color: #721c24;"><strong>Rejection Reason:</strong> ${res.rejectionReason}</p>` : ''}
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
        'pending-adviser': '<span class="badge pending-adviser">Pending Adviser Review</span>',
        'pending-admin': '<span class="badge pending-admin">Pending Admin Review</span>',
        'approved': '<span class="badge approved">Approved</span>',
        'rejected': '<span class="badge rejected">Rejected</span>'
    };
    return badges[status] || '<span class="badge pending-adviser">Pending</span>';
}

function updateStats(reservations) {
    const total = reservations.length;
    const pending = reservations.filter(r => r.status === 'pending-adviser' || r.status === 'pending-admin').length;
    const approved = reservations.filter(r => r.status === 'approved').length;
    
    const statCards = document.querySelectorAll('.stat-card h3');
    if (statCards.length >= 3) {
        statCards[0].textContent = total;
        statCards[1].textContent = pending;
        statCards[2].textContent = approved;
    }
}

// Room Availability Functions
function loadRoomAvailability() {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const rooms = ['Lecture Room', 'Chemistry Room', 'Biology Room', 'Psychology Room'];
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
    document.addEventListener('DOMContentLoaded', loadTeacherDashboard);
} else {
    loadTeacherDashboard();
}
