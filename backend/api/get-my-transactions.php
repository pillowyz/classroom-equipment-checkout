<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once '../config/database.php';

session_start();

// Get student_id from session or request
$studentId = isset($_GET['student_id']) ? $_GET['student_id'] : (isset($_SESSION['student_id']) ? $_SESSION['student_id'] : null);

if ($studentId) {
    
    $database = new Database();
    $db = $database->getConnection();
    
    // Get active transactions (not returned yet)
    $query = "SELECT 
                t.transaction_id,
                t.checkout_date,
                t.expected_return_date,
                t.actual_return_date,
                t.quantity,
                d.device_name,
                d.device_type,
                d.device_id
              FROM transactions t
              JOIN devices d ON t.device_id = d.device_id
              WHERE t.student_id = :student_id
              ORDER BY t.checkout_date DESC";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':student_id', $studentId);
    $stmt->execute();
    
    $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "data" => $transactions
    ]);
    
} else {
    echo json_encode([
        "success" => false,
        "message" => "Student ID is required"
    ]);
}
?>