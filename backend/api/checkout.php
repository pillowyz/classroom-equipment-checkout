<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php';

session_start();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->device_id) && !empty($data->student_id)) {
    
    $database = new Database();
    $db = $database->getConnection();
    
    // Check if device is available
    $query = "SELECT status FROM devices WHERE device_id = :device_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':device_id', $data->device_id);
    $stmt->execute();
    
    $device = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($device && $device['status'] == 'Available') {
        
        // Calculate expected return date (7 days from now)
        $expectedReturnDate = date('Y-m-d H:i:s', strtotime('+7 days'));
        
        // Create transaction (trigger will update device status automatically)
        $query = "INSERT INTO transactions 
                  (student_id, device_id, quantity, checkout_date, expected_return_date) 
                  VALUES 
                  (:student_id, :device_id, 1, NOW(), :expected_return_date)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':student_id', $data->student_id);
        $stmt->bindParam(':device_id', $data->device_id);
        $stmt->bindParam(':expected_return_date', $expectedReturnDate);
        
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Equipment checked out successfully",
                "transaction_id" => $db->lastInsertId()
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to checkout equipment"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Equipment is not available"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Device ID and student ID are required"
    ]);
}
?>