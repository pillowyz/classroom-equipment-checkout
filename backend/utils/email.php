<?php
function send2FAEmail($to, $code) {
    $subject = "Your Equipment Checkout Verification Code";
    $message = "Your verification code is: " . $code . "\n\n";
    $message .= "This code will expire in 5 minutes.\n";
    $message .= "If you didn't request this code, please ignore this email.";
    
    $headers = "From: noreply@equipmentcheckout.com";
    
    // For development, just return true
    // In production, use mail() or a service like PHPMailer
    return true;
    
    // Uncomment for actual email sending:
    // return mail($to, $subject, $message, $headers);
}
?>