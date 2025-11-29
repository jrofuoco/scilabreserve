// Reservation Form Functions
const userRole = sessionStorage.getItem('userRole');

// Initialize reservation type selector based on user role
function initializeTypeSelector() {
    const typeSelector = document.getElementById('type-selector');
    if (!typeSelector) return;
    
    typeSelector.innerHTML = '';
    
    // Teachers can reserve: lab, equipment, chemical, glassware
    if (userRole === 'teacher') {
        const types = [
            { value: 'lab-room', label: 'Lab Room' },
            { value: 'equipment', label: 'Equipment' },
            { value: 'chemical', label: 'Chemical' },
            { value: 'glassware', label: 'Glassware' }
        ];
        
        types.forEach(type => {
            const button = document.createElement('div');
            button.className = 'type-button';
            button.textContent = type.label;
            button.dataset.type = type.value;
            button.onclick = () => selectReservationType(type.value);
            typeSelector.appendChild(button);
        });
    } 
    // Students can reserve: equipment, chemical, glassware (NO lab rooms)
    else if (userRole === 'student') {
        const types = [
            { value: 'equipment', label: 'Equipment' },
            { value: 'chemical', label: 'Chemical' },
            { value: 'glassware', label: 'Glassware' }
        ];
        
        types.forEach(type => {
            const button = document.createElement('div');
            button.className = 'type-button';
            button.textContent = type.label;
            button.dataset.type = type.value;
            button.onclick = () => selectReservationType(type.value);
            typeSelector.appendChild(button);
        });
    }
}

function selectReservationType(type) {
    // Update hidden input
    document.getElementById('reservationType').value = type;
    
    // Update button styles
    document.querySelectorAll('.type-button').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.type === type) {
            btn.classList.add('selected');
        }
    });
    
    // Hide all form sections
    document.querySelectorAll('.type-form-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected form section
    const formSection = document.getElementById(`${type}-form`);
    if (formSection) {
        formSection.classList.add('active');
    }
    
    // Show purpose field and submit section
    document.getElementById('purpose-field').style.display = 'block';
    document.getElementById('submit-section').style.display = 'flex';
    
    // Set minimum date to today for all date inputs
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
        input.setAttribute('min', today);
        if (!input.value) input.value = today;
    });
}

// Initialize date inputs
const today = new Date().toISOString().split('T')[0];
document.querySelectorAll('input[type="date"]').forEach(input => {
    input.setAttribute('min', today);
});

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTypeSelector);
} else {
    initializeTypeSelector();
}
