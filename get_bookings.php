<?php
include "db.php";

$result = $conn->query("SELECT reservation_date, reservation_time FROM reservations");

$bookings = [];

while ($row = $result->fetch_assoc()) {
  $bookings[] = $row;
}

echo json_encode($bookings);
?>