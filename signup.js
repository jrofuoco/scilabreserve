// Sign Up Form Handler
const signupForm = document.querySelector("#signup-form"); 
// Ensure your signup.html form has the ID: <form id="signup-form">

if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // 1. Collect and clean data from the form (CORRECTED NAMES)
        const formData = new FormData(signupForm);
        const username = formData.get("username")?.trim();
        const firstName = formData.get("firstName")?.trim();        // FIXED: Matches HTML name="firstName"
        const lastName = formData.get("lastName")?.trim();          // FIXED: Matches HTML name="lastName"
        const email = formData.get("email")?.trim();
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");    // FIXED: Matches HTML name="confirmPassword"

        // 2. Client-side Validation (This is the check that was failing)
        if (!username || !firstName || !lastName || !email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        // 3. Create JSON payload (Keys must match the PHP script's expected data keys)
        const payload = {
            username: username,
            firstName: firstName, 
            lastName: lastName,   
            email: email,
            password: password
        };

        try {
            // 4. Send the data to the PHP script using AJAX/fetch
            const response = await fetch("backend/signup.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            // 5. Process the JSON response
            const result = await response.json();

            if (!response.ok || !result.success) {
                // Throw the error message provided by the PHP backend
                throw new Error(result.message || "Failed to create account. Check server logs.");
            }

            // Success handling
            alert("Account created successfully! You can now login.");
            window.location.href = "index.html"; // Redirect to your login page
        } catch (error) {
            // Display the error from the server or a generic message
            alert(error.message || "An unexpected error occurred. Please try again.");
        }
    });
}