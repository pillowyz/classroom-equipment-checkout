<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php';
require_once '../utils/email.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    // Generate 6-digit code
    $code = sprintf("%06d", mt_rand(1, 999999));
    
    // Store code in session (in production, store in database)
    session_start();
    $_SESSION['2fa_code'] = $code;
    $_SESSION['2fa_email'] = $data->email;
    $_SESSION['2fa_time'] = time();
    
    // Send email
    $emailSent = send2FAEmail($data->email, $code);
    
    if ($emailSent) {
        echo json_encode([
            "success" => true,
            "message" => "Verification code sent to your email"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Failed to send verification code"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Email and password are required"
    ]);
}
?>