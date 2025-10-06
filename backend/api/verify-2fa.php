<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Start session
session_start();

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// For debugging - log what we receive
error_log("Received data: " . print_r($data, true));

if (!empty($data->code) && !empty($data->email)) {
    // For development, accept any 6-digit code
    if (strlen($data->code) == 6 && is_numeric($data->code)) {
        
        // Generate token
        $token = bin2hex(random_bytes(32));
        
        // Store in session
        $_SESSION['auth_token'] = $token;
        $_SESSION['user_email'] = $data->email;
        
        // Get user name from email
        $emailParts = explode('@', $data->email);
        $userName = $emailParts[0];
        
        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "token" => $token,
            "user" => [
                "email" => $data->email,
                "name" => ucfirst($userName)
            ]
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Please enter a valid 6-digit code"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Code and email are required"
    ]);
}
?>