<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->device_id)) {
    $database = new Database();
    $db = $database->getConnection();
    
    $query = "UPDATE devices SET 
              status = 'Available',
              checked_out_by = NULL
              WHERE device_id = :device_id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':device_id', $data->device_id);
    
    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Equipment returned successfully"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Failed to return equipment"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Device ID is required"
    ]);
}
?>