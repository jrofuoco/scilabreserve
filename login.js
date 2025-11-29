async function authenticateUser(username, password) {
    try {
        const response = await fetch("backend/login.php", {
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

        return {
            username: result.user.username,
            role: result.user.role,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            email: result.user.email,
            id: String(result.user.id)
        };

    } catch (error) {
        console.error("Authentication failed:", error.message);
        return null;
    }
}

const loginForm = document.querySelector("#login-form");
const messageDisplay = document.querySelector("#login-message");
const submitButton = document.querySelector("#login-button");

if (loginForm && messageDisplay && submitButton) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = loginForm.username.value.trim();
        const password = loginForm.password.value.trim();

        if (!username || !password) {
            messageDisplay.textContent = "Please fill in all fields.";
            messageDisplay.className = 'text-center text-sm font-medium text-red-600 mt-2';
            return;
        }

        messageDisplay.textContent = 'Authenticating...';
        messageDisplay.className = 'text-center text-sm font-medium text-blue-600 mt-2';
        submitButton.disabled = true;

        const user = await authenticateUser(username, password);

        if (!user) {
            messageDisplay.textContent = "Invalid username or password.";
            messageDisplay.className = 'text-center text-sm font-medium text-red-600 mt-2';
            submitButton.disabled = false;
            return;
        }

        messageDisplay.textContent = `Login successful! Redirecting...`;
        messageDisplay.className = 'text-center text-sm font-medium text-green-600 mt-2';

        sessionStorage.setItem("userRole", user.role);
        sessionStorage.setItem("username", user.username);
        sessionStorage.setItem("userId", user.id);
        sessionStorage.setItem("userFullName", `${user.firstName} ${user.lastName}`.trim());

        setTimeout(() => {
            if (user.role === "admin") {
                window.location.href = "admin.html";
            } else if (user.role === "teacher") {
                window.location.href = "teacher.html";
            } else if (user.role === "student") {
                window.location.href = "student.html";
            } else {
                window.location.href = "dashboard.html";
            }
        }, 800);
    });
} else {
    console.error("Required DOM elements for login form not found.");
}