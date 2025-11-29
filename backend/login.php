<?php
// Start a session to manage user login state
session_start();

// Include the database connection file.
// IMPORTANT: This file establishes $conn and sets the JSON header.
require_once('db-connector.php');

// Ensure the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit;
}

// Read JSON data from the request body
$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);

// Check if username and password were provided
if (!isset($data['username']) || !isset($data['password'])) {
    http_response_code(400); // Bad Request
    echo json_encode(["success" => false, "message" => "Please provide both username and password."]);
    exit;
}

$input_username = $data['username'];
$input_password = $data['password'];

global $conn;

// --- FIX: Fetch all necessary user columns ---
$sql = "SELECT id, username, password, first_name, last_name, email, roles FROM users WHERE username = ?";
// ---------------------------------------------

// 1. Prepare the statement
if ($stmt = $conn->prepare($sql)) {
    // 2. Bind parameters (s for string)
    $stmt->bind_param("s", $input_username);

    // 3. Execute the statement
    $stmt->execute();

    // 4. Get the result
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        // 5. Verify the hashed password
        if (password_verify($input_password, $user['password'])) {
            
            // Password is correct! Set session variables
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['roles'] = $user['roles'];
            $_SESSION['logged_in'] = true;

            // Successful login response
            // --- FIX: Map database column names to frontend expected names ---
            echo json_encode([
                "success" => true, 
                "message" => "Login successful!",
                "user" => [
                    "id" => $user['id'],
                    "username" => $user['username'],
                    "firstName" => $user['first_name'], // Mapped from DB
                    "lastName" => $user['last_name'],   // Mapped from DB
                    "email" => $user['email'],
                    "role" => $user['roles']           // Mapped from DB
                ]
            ]);
            // -----------------------------------------------------------------
            
        } else {
            // Incorrect password
            http_response_code(401); // Unauthorized
            echo json_encode(["success" => false, "message" => "Invalid username or password."]);
        }
    } else {
        // User not found
        http_response_code(401); // Unauthorized
        echo json_encode(["success" => false, "message" => "Invalid username or password."]);
    }

    // Close the statement
    $stmt->close();

} else {
    // Error preparing the statement
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error preparing query."]);
}

// Close the database connection (handled by global $conn from db-connector.php)
$conn->close();
?>