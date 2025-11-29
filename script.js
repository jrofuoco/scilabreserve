// Login Form Handler
const loginForm = document.querySelector("#login-form");

// Default credentials for all roles
const defaultCredentials = {
    admin: { username: "admin", password: "admin123", role: "admin", firstName: "Admin", lastName: "User", id: 1 },
    teacher: { username: "teacher", password: "teacher123", role: "teacher", firstName: "Teacher", lastName: "User", id: 2 },
    student: { username: "student", password: "student123", role: "student", firstName: "Student", lastName: "User", id: 3 }
};

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const username = loginForm.username.value;
        const password = loginForm.password.value;
        
        if (!username || !password) {
            alert("Please fill in all fields.");
            return;
        }
        
        let user = null;
        
        // Check default credentials first
        for (const creds of Object.values(defaultCredentials)) {
            if (username === creds.username && password === creds.password) {
                user = creds;
                break;
            }
        }
        
        if (!user) {
            user = await authenticateUser(username, password);
            if (!user) {
                return;
            }
        }
        
        // Store user info in sessionStorage
        sessionStorage.setItem("userRole", user.role);
        sessionStorage.setItem("username", user.username);
        sessionStorage.setItem("userId", (user.id || user.username).toString());
        sessionStorage.setItem("userFullName", `${user.firstName} ${user.lastName}`.trim());
        
        // Redirect based on user's role
        if (user.role === "admin") {
            window.location.href = "admin.html";
        } else if (user.role === "teacher") {
            window.location.href = "teacher.html";
        } else if (user.role === "student") {
            window.location.href = "student.html";
        }
    });
}

async function authenticateUser(username, password) {
    try {
        const response = await fetch("login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });
        
        const result = await response.json();
        
        if (!response.ok || !result.success) {
            throw new Error(result.message || "Invalid username or password.");
        }
        
        const { firstName, lastName } = splitFullName(result.user.name);
        
        return {
            username: result.user.username,
            role: result.user.role,
            firstName,
            lastName,
            email: result.user.email,
            id: result.user.username
        };
    } catch (error) {
        alert(error.message || "Unable to login. Please try again.");
        return null;
    }
}

function splitFullName(fullName = "") {
    const trimmed = fullName.trim();
    if (trimmed === "") {
        return { firstName: "", lastName: "" };
    }
    
    const [firstName, ...rest] = trimmed.split(/\s+/);
    return {
        firstName,
        lastName: rest.join(" ")
    };
}

// Reservation Form Handler
const reservationForm = document.querySelector("#reservation-form");

if (reservationForm) {
    reservationForm.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const formData = new FormData(reservationForm);
        const reservationType = formData.get("reservationType");
        const userRole = sessionStorage.getItem("userRole");
        const username = sessionStorage.getItem("username");
        
        if (!reservationType) {
            alert("Please select a reservation type.");
            return;
        }
        
        let newReservation = {
            id: Date.now(),
            reservationType: reservationType,
            userType: userRole,
            username: username,
            purpose: formData.get("purpose"),
            status: "pending-adviser", // Start with Adviser review
            createdAt: new Date().toISOString()
        };
        
        // Add type-specific fields
        if (reservationType === "equipment") {
            const equipmentName = formData.get("equipmentName");
            const quantity = formData.get("equipmentQuantity");
            const date = formData.get("equipment-date");
            const time = formData.get("equipment-time");
            
            if (!equipmentName || !quantity || !date || !time) {
                alert("Please fill in all required fields for equipment reservation.");
                return;
            }
            newReservation.equipmentName = equipmentName;
            newReservation.equipmentQuantity = quantity;
            newReservation.date = date;
            newReservation.time = time;
        } else if (reservationType === "chemical") {
            const chemicalName = formData.get("chemicalName");
            const quantity = formData.get("chemicalQuantity");
            const date = formData.get("chemical-date");
            const time = formData.get("chemical-time");
            
            if (!chemicalName || !quantity || !date || !time) {
                alert("Please fill in all required fields for chemical reservation.");
                return;
            }
            newReservation.chemicalName = chemicalName;
            newReservation.chemicalQuantity = quantity;
            newReservation.date = date;
            newReservation.time = time;
            newReservation.safetyNotes = formData.get("safetyNotes") || "";
        } else if (reservationType === "glassware") {
            const glasswareName = formData.get("glasswareName");
            const quantity = formData.get("glasswareQuantity");
            const date = formData.get("glassware-date");
            const time = formData.get("glassware-time");
            
            if (!glasswareName || !quantity || !date || !time) {
                alert("Please fill in all required fields for glassware reservation.");
                return;
            }
            newReservation.glasswareName = glasswareName;
            newReservation.glasswareQuantity = quantity;
            newReservation.date = date;
            newReservation.time = time;
        } else if (reservationType === "lab-room") {
            // Only teachers can reserve lab rooms
            if (userRole !== "teacher") {
                alert("Students cannot reserve lab rooms.");
                return;
            }
            
            const lab = formData.get("lab");
            const duration = formData.get("lab-duration");
            const date = formData.get("lab-date");
            const time = formData.get("lab-time");
            
            if (!lab || !duration || !date || !time) {
                alert("Please fill in all required fields for lab room reservation.");
                return;
            }
            newReservation.lab = lab;
            newReservation.duration = duration;
            newReservation.date = date;
            newReservation.time = time;
            newReservation.participants = formData.get("lab-participants") || "1";
        }
        
        // Store reservation in localStorage
        const reservations = JSON.parse(localStorage.getItem("reservations") || "[]");
        reservations.push(newReservation);
        localStorage.setItem("reservations", JSON.stringify(reservations));
        
        // Show success message
        const typeLabels = {
            "equipment": "Equipment",
            "chemical": "Chemical",
            "glassware": "Glassware",
            "lab-room": "Lab Room"
        };
        const typeLabel = typeLabels[reservationType] || reservationType;
        
        const summary = `Reservation submitted successfully!\n\n` +
            `Type: ${typeLabel}\n` +
            `Date: ${new Date(newReservation.date).toLocaleDateString()}\n` +
            `Time: ${newReservation.time}\n` +
            `Status: Pending Adviser Review\n\n` +
            `Your reservation will be reviewed by an Adviser Teacher, then forwarded to Admin for final approval.`;
        
        alert(summary);
        
        // Redirect based on user role
        if (userRole === "teacher") {
            window.location.href = "teacher.html";
        } else {
            window.location.href = "student.html";
        }
    });
}

// Adviser (Teacher) Approval Functions
function approveReservation(id) {
    const reservations = JSON.parse(localStorage.getItem("reservations") || "[]");
    const res = reservations.find(r => r.id === id);
    
    if (res && res.status === "pending-adviser") {
        res.status = "pending-admin"; // Forward to Admin
        res.adviserApprovedAt = new Date().toISOString();
        res.adviserName = sessionStorage.getItem("username");
        localStorage.setItem("reservations", JSON.stringify(reservations));
        alert(`Reservation #${id} has been approved by Adviser and forwarded to Admin for final review.`);
        location.reload();
    } else {
        alert("This reservation is not pending Adviser review.");
    }
}

function rejectReservation(id) {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason) {
        const reservations = JSON.parse(localStorage.getItem("reservations") || "[]");
        const res = reservations.find(r => r.id === id);
        
        if (res && res.status === "pending-adviser") {
            res.status = "rejected";
            res.rejectionReason = reason;
            res.rejectedBy = "adviser";
            res.rejectedAt = new Date().toISOString();
            localStorage.setItem("reservations", JSON.stringify(reservations));
            alert(`Reservation #${id} has been rejected. Student will be notified with the reason.`);
            location.reload();
        } else {
            alert("This reservation is not pending Adviser review.");
        }
    }
}

// Admin Approval Functions
function adminApprove(id) {
    const reservations = JSON.parse(localStorage.getItem("reservations") || "[]");
    const res = reservations.find(r => r.id === id);
    
    if (res && res.status === "pending-admin") {
        res.status = "approved";
        res.adminApprovedAt = new Date().toISOString();
        res.adminName = sessionStorage.getItem("username");
        
        // For equipment, chemical, and glassware reservations, set return status
        if (res.reservationType === "equipment" || res.reservationType === "chemical" || res.reservationType === "glassware") {
            res.returnStatus = "pending-return";
        }
        
        localStorage.setItem("reservations", JSON.stringify(reservations));
        alert(`Reservation #${id} has been approved by Admin. Teacher and Student will be notified.`);
        location.reload();
    } else {
        alert("This reservation is not pending Admin review.");
    }
}

function adminReject(id) {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason) {
        const reservations = JSON.parse(localStorage.getItem("reservations") || "[]");
        const res = reservations.find(r => r.id === id);
        
        if (res && res.status === "pending-admin") {
            res.status = "rejected";
            res.rejectionReason = reason;
            res.rejectedBy = "admin";
            res.rejectedAt = new Date().toISOString();
            localStorage.setItem("reservations", JSON.stringify(reservations));
            alert(`Reservation #${id} has been rejected. Teacher and Student will be notified with the reason.`);
            location.reload();
        } else {
            alert("This reservation is not pending Admin review.");
        }
    }
}

// Logout function
function logout() {
    // Clear all sessionStorage
    sessionStorage.clear();
    // Redirect to login page
    window.location.href = "index.html";
}

// Check authentication on protected pages
function checkAuth() {
    const userRole = sessionStorage.getItem("userRole");
    const currentPage = window.location.pathname.split("/").pop();
    
    // Pages that don't require authentication
    const publicPages = ["index.html", "signup.html", ""];
    
    // If not logged in and trying to access protected pages
    if (!userRole && !publicPages.includes(currentPage)) {
        window.location.href = "index.html";
    }
    
    // If logged in and trying to access login/signup pages, redirect to dashboard
    if (userRole && (currentPage === "index.html" || currentPage === "signup.html")) {
        if (userRole === "admin") {
            window.location.href = "admin.html";
        } else if (userRole === "teacher") {
            window.location.href = "teacher.html";
        } else if (userRole === "student") {
            window.location.href = "student.html";
        }
    }
}

// Run auth check on page load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkAuth);
} else {
    checkAuth();
}
