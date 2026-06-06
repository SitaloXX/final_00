<?php
include "db.php";

$name = $_POST["full_name"];
$phone = $_POST["phone"];
$email = $_POST["email"];
$date = $_POST["date"];
$time = $_POST["time"];
$guests = $_POST["guests"];
$message = $_POST["message"];

$sql = "INSERT INTO reservations 
(full_name, phone, email, reservation_date, reservation_time, guests, message)
VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssis", $name, $phone, $email, $date, $time, $guests, $message);

if ($stmt->execute()) {
  echo json_encode(["success" => true, "message" => "Reservation booked successfully"]);
} else {
  echo json_encode(["success" => false, "message" => "Reservation failed"]);
}
?>