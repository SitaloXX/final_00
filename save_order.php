<?php
include "db.php";

$name = $_POST["customer_name"];
$phone = $_POST["phone"];
$email = $_POST["email"];
$address = $_POST["address"];
$items = $_POST["items"];
$total = $_POST["total"];
$payment = $_POST["payment_method"];

$sql = "INSERT INTO orders 
(customer_name, phone, email, address, items, total_amount, payment_method)
VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssss", $name, $phone, $email, $address, $items, $total, $payment);

if ($stmt->execute()) {
  echo json_encode(["success" => true, "message" => "Order placed successfully"]);
} else {
  echo json_encode(["success" => false, "message" => "Order failed"]);
}
?>