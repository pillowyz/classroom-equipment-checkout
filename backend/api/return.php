<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php';

session_start();

// Get the posted data
$data = json_decode(file_get_contents("php://input"));

// Log what we received for debugging
error_log("Return request data: " . print_r($data, true));

if (!empty($data->transaction_id)) {
    
    $database = new Database();
    $db = $database->getConnection();
    
    // Update transaction with return date (trigger will update device status)
    $query = "UPDATE transactions 
              SET actual_return_date = NOW() 
              WHERE transaction_id = :transaction_id 
              AND actual_return_date IS NULL";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':transaction_id', $data->transaction_id);
    
    if ($stmt->execute()) {
        if ($stmt->rowCount() > 0) {
            echo json_encode([
                "success" => true,
                "message" => "Equipment returned successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Transaction not found or already returned"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Failed to update transaction"
        ]);
    }
} else {
    // Log the error
    error_log("Missing transaction_id. Received: " . json_encode($data));
    
    echo json_encode([
        "success" => false,
        "message" => "Transaction ID is required. Received: " . json_encode($data)
    ]);
}
?>