<?php

session_start();

require_once('db-connector.php');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit;
}

$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);

if (!isset($data['username']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Please provide both username and password."]);
    exit;
}

$input_username = $data['username'];
$input_password = $data['password'];

global $conn;

$sql = "SELECT id, username, password, first_name, last_name, email, roles FROM users WHERE username = ?";

if ($stmt = $conn->prepare($sql)) {
    $stmt->bind_param("s", $input_username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        if (password_verify($input_password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['roles'] = $user['roles'];
            $_SESSION['logged_in'] = true;

            echo json_encode([
                "success" => true,
                "message" => "Login successful!",
                "user" => [
                    "id" => $user['id'],
                    "username" => $user['username'],
                    "firstName" => $user['first_name'],
                    "lastName" => $user['last_name'],
                    "email" => $user['email'],
                    "role" => $user['roles']
                ]
            ]);
            
        } else {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Invalid username or password."]);
        }
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Invalid username or password."]);
    }

    $stmt->close();

} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error preparing query."]);
}

$conn->close();
?>