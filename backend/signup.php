<?php
// === db-connector.php content start ===
$servername = "localhost";
$username = "root";       // Default XAMPP MySQL user
$password = "";           // Default XAMPP MySQL password is empty
$dbname = "scilabreserve"; // The database name we created in phpMyAdmin

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    // If connection fails, stop the script and return a 500 server error
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit(); 
}
// === db-connector.php content end ===


// Always set the header for a JSON API response
header('Content-Type: application/json');

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

// 1. Read and decode the JSON payload from the JavaScript fetch request
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Check for valid JSON data
if ($data === null) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid JSON data received."]);
    exit();
}

// 2. Extract data (using the CamelCase keys from your HTML/JS)
$username = $data['username'] ?? '';
$firstName = $data['firstName'] ?? '';
$lastName = $data['lastName'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// 3. Server-side Validation
if (empty($username) || empty($firstName) || empty($lastName) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Please fill in all required fields."]);
    exit();
}

// Basic email format check
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid email format."]);
    exit();
}

// 4. Security: Hash the password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// 5. Check if username or email already exists using a PREPARED STATEMENT
$check_sql = "SELECT id FROM users WHERE username = ? OR email = ?";
$check_stmt = $conn->prepare($check_sql);
$check_stmt->bind_param("ss", $username, $email);
$check_stmt->execute();
$check_stmt->store_result();

if ($check_stmt->num_rows > 0) {
    $check_stmt->close();
    http_response_code(409); // 409 Conflict
    echo json_encode(["success" => false, "message" => "Username or Email already exists."]);
    exit();
}
$check_stmt->close();

// 6. Insert the new user into the database
$insert_sql = "INSERT INTO users (username, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($insert_sql);

// Bind parameters: 's' for string (s s s s s)
$stmt->bind_param("sssss", $username, $firstName, $lastName, $email, $hashed_password);

if ($stmt->execute()) {
    // Success response
    http_response_code(201); // 201 Created
    echo json_encode(["success" => true, "message" => "Registration successful!"]);
} else {
    // Failure response
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database Error: " . $stmt->error]);
}

// Close resources
$stmt->close();
$conn->close();
// !!! END OF FILE - NO HTML BELOW THIS POINT !!!
?>