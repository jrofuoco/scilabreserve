const signupForm = document.querySelector("#signup-form");

if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(signupForm);
        const username = formData.get("username")?.trim();
        const firstName = formData.get("firstName")?.trim();
        const lastName = formData.get("lastName")?.trim();
        const email = formData.get("email")?.trim();
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");

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

        const payload = {
            username: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        };

        try {
            const response = await fetch("backend/signup.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to create account. Check server logs.");
            }

            alert("Account created successfully! You can now login.");
            window.location.href = "index.html";
        } catch (error) {
            alert(error.message || "An unexpected error occurred. Please try again.");
        }
    });
}