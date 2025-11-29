/**
 * Sends a request to the server to authenticate the user.
 * @param {string} username - The username entered.
 * @param {string} password - The password entered.
 * @returns {Promise<object|null>} - A promise that resolves to the user object or null on failure.
 */
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
            // Throw error with server message to be displayed in the UI
            throw new Error(result.message || "Invalid username or password.");
        }
        
        // Use fields directly from the server response (firstName, lastName, etc.)
        return {
            username: result.user.username,
            role: result.user.role,
            firstName: result.user.firstName, 
            lastName: result.user.lastName,
            email: result.user.email,
            id: String(result.user.id) // Ensure ID is stored as a string
        };
        

    } catch (error) {
        // Return null on authentication failure, allowing the caller to display the error.
        console.error("Authentication failed:", error.message);
        return null;
    }
}

// Login Form Handler
const loginForm = document.querySelector("#login-form");
const messageDisplay = document.querySelector("#login-message");
const submitButton = document.querySelector("#login-button");


if (loginForm && messageDisplay && submitButton) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Get and validate input
        const username = loginForm.username.value.trim();
        const password = loginForm.password.value.trim();

        if (!username || !password) {
            messageDisplay.textContent = "Please fill in all fields.";
            messageDisplay.className = 'text-center text-sm font-medium text-red-600 mt-2';
            return;
        }

        // Set loading state
        messageDisplay.textContent = 'Authenticating...';
        messageDisplay.className = 'text-center text-sm font-medium text-blue-600 mt-2';
        submitButton.disabled = true;

        // 1. Try server (database) authentication.
        const user = await authenticateUser(username, password);
        
        if (!user) {
            // Final failure message if DB credentials don't work.
            messageDisplay.textContent = "Invalid username or password.";
            messageDisplay.className = 'text-center text-sm font-medium text-red-600 mt-2';
            submitButton.disabled = false;
            return;
        }
        
        // Authentication SUCCESS
        messageDisplay.textContent = `Login successful! Redirecting...`;
        messageDisplay.className = 'text-center text-sm font-medium text-green-600 mt-2';

        // Store user info in sessionStorage
        sessionStorage.setItem("userRole", user.role);
        sessionStorage.setItem("username", user.username);
        sessionStorage.setItem("userId", user.id);
        sessionStorage.setItem("userFullName", `${user.firstName} ${user.lastName}`.trim());
        
        // Redirect based on user's role
        // Added a short delay for the user to see the success message
        setTimeout(() => {
            if (user.role === "admin") {
                window.location.href = "admin.html";
            } else if (user.role === "teacher") {
                window.location.href = "teacher.html";
            } else if (user.role === "student") {
                window.location.href = "student.html";
            } else {
                // Default fallback page
                 window.location.href = "dashboard.html"; 
            }
        }, 800);
    });
} else {
    console.error("Required DOM elements for login form not found.");
}