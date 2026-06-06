<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "puime_restaurant";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
  die(json_encode([
    "success" => false,
    "message" => "Database connection failed"
  ]));
}
?>