<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$query = "SELECT * FROM devices ORDER BY device_name";
$stmt = $db->prepare($query);
$stmt->execute();

$devices = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "data" => $devices
]);
?>