CREATE DATABASE puime_restaurant;
USE puime_restaurant;

CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100),
  phone VARCHAR(30),
  email VARCHAR(100),
  reservation_date DATE,
  reservation_time TIME,
  guests INT,
  message TEXT,
  status VARCHAR(30) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100),
  phone VARCHAR(30),
  email VARCHAR(100),
  address TEXT,
  items TEXT,
  total_amount DECIMAL(10,2),
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'Pending',
  order_status VARCHAR(50) DEFAULT 'Received',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);