// Student Dashboard Functions
function loadStudentDashboard() {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const username = sessionStorage.getItem('username');
    
    const myReservations = reservations.filter(r => r.userType === 'student' && r.username === username);
    const list = document.getElementById('reservations-list');
    if (list) {
        list.innerHTML = '';
        
        if (myReservations.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No reservations found. Create a new reservation to get started.</p>';
        } else {
            myReservations.forEach(res => {
                list.appendChild(createReservationItem(res));
            });
        }
    }
}

function createReservationItem(res) {
    const div = document.createElement('div');
    div.className = 'reservation-item';
    div.dataset.status = res.status;
    
    const typeLabel = res.reservationType === 'equipment' ? 'Equipment' : 
                    res.reservationType === 'chemical' ? 'Chemical' :
                    res.reservationType === 'glassware' ? 'Glassware' : 'Lab Room';
    const title = res.reservationType === 'equipment' ? res.equipmentName :
                 res.reservationType === 'chemical' ? res.chemicalName :
                 res.reservationType === 'glassware' ? res.glasswareName :
                 res.lab;
    
    const statusBadge = getStatusBadge(res.status);
    
    div.innerHTML = `
        <div class="reservation-info">
            <h4>${typeLabel}: ${title}</h4>
            <p><strong>Date:</strong> ${new Date(res.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${res.time}</p>
            <p><strong>Purpose:</strong> ${res.purpose}</p>
            ${res.rejectionReason ? `<p style="color: #721c24; margin-top: 0.5rem;"><strong>Rejection Reason:</strong> ${res.rejectionReason}</p>` : ''}
        </div>
        <div>
            ${statusBadge}
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

function filterReservations(status) {
    const items = document.querySelectorAll('.reservation-item');
    items.forEach(item => {
        if (status === 'all' || item.dataset.status === status) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Load dashboard on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadStudentDashboard);
} else {
    loadStudentDashboard();
}
