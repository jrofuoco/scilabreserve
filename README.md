# Sci Lab Reserve System

A web-based laboratory reservation system with role-based access (Admin, Teacher, Student) and multi-level approval workflow.

## Features

- ✅ Role-based access (Admin, Teacher, Student)
- ✅ Three reservation types (Equipment, Chemical, Lab Room)
- ✅ Multi-level approval workflow (Adviser → Admin)
- ✅ Status tracking and notifications
- ✅ Responsive design matching modern UI standards
- ✅ Frontend-only (uses localStorage - no backend required)

## Quick Start

### No Installation Required!

This is a **frontend-only** system that works directly in your browser:

1. **Open `index.html`** in your web browser
2. **Login** with any username/password and select a role
3. **Start using** the system!

### File Structure

```
scilab-reserve/
├── index.html          # Login page
├── teacher.html        # Teacher dashboard
├── student.html        # Student dashboard
├── reservation.html    # Reservation form
├── admin.html          # Admin dashboard (if exists)
├── script.js           # Main JavaScript logic
├── teacher-dashboard.js # Teacher dashboard logic
├── student-dashboard.js # Student dashboard logic
├── reservation-form.js  # Reservation form logic
├── styles.css          # All styling
└── README.md          # This file
```

## Usage

1. **Login**: Select your role (Admin, Teacher, or Student) and enter any username/password
2. **Make Reservation**: Choose reservation type (Equipment, Chemical, or Lab Room)
3. **Approval Workflow**: 
   - Student/Teacher submits → Pending Adviser Review
   - Adviser (Teacher) approves → Pending Admin Review
   - Admin approves → Approved

## Browser Compatibility

Works on all modern browsers (Chrome, Firefox, Safari, Edge)

## Technologies

- HTML5
- CSS3
- JavaScript (Vanilla)
- LocalStorage (for data storage)

## Note

This is a **frontend demo system** using browser localStorage. Data is stored locally in your browser and is not shared between users or devices.

For production use with shared data, you would need:
- Backend server (Node.js, PHP, Python, etc.)
- Database (MySQL, PostgreSQL, MongoDB, etc.)
- API endpoints
- Real authentication system

## License

MIT License
