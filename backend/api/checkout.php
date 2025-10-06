<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->device_id) && !empty($data->student_name)) {
    $database = new Database();
    $db = $database->getConnection();
    
    // Check if device is available
    $query = "SELECT status FROM devices WHERE device_id = :device_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':device_id', $data->device_id);
    $stmt->execute();
    
    $device = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($device && $device['status'] == 'Available') {
        // Update device
        $query = "UPDATE devices SET 
                  status = 'Unavailable',
                  last_checked_out = NOW(),
                  checked_out_by = :student_name
                  WHERE device_id = :device_id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':student_name', $data->student_name);
        $stmt->bindParam(':device_id', $data->device_id);
        
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Equipment checked out successfully"
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
        "message" => "Device ID and student name are required"
    ]);
}
?>