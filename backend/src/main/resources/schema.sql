-- H2 Database Schema for Donation Platform

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS fulfillment;
DROP TABLE IF EXISTS request_item;
DROP TABLE IF EXISTS request;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(500),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    house_number VARCHAR(255),
    street_landmark VARCHAR(255),
    area_locality VARCHAR(255),
    city VARCHAR(255),
    district VARCHAR(255),
    state VARCHAR(255),
    pincode VARCHAR(20),
    country VARCHAR(255)
);

-- Create request table
CREATE TABLE request (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255),
    location VARCHAR(500),
    status VARCHAR(30) DEFAULT 'OPEN',
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create request_item table
CREATE TABLE request_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_id BIGINT NOT NULL,
    item_name VARCHAR(255),
    required_quantity INT NOT NULL DEFAULT 0,
    fulfilled_quantity INT NOT NULL DEFAULT 0,
    FOREIGN KEY (request_id) REFERENCES request(id) ON DELETE CASCADE
);

-- Create fulfillment table
CREATE TABLE fulfillment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    donor_id BIGINT NOT NULL,
    request_item_id BIGINT NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING',
    quantity INT NOT NULL DEFAULT 0,
    fulfilled_at TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (request_item_id) REFERENCES request_item(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_request_user_id ON request(user_id);
CREATE INDEX idx_request_status ON request(status);
CREATE INDEX idx_request_item_request_id ON request_item(request_id);
CREATE INDEX idx_fulfillment_donor_id ON fulfillment(donor_id);
CREATE INDEX idx_fulfillment_request_item_id ON fulfillment(request_item_id);
CREATE INDEX idx_fulfillment_status ON fulfillment(status);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
