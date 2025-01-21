-- Create database
CREATE DATABASE IF NOT EXISTS construction_management;
USE construction_management;

-- Create tables
CREATE TABLE IF NOT EXISTS tbl_activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_measures (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_companies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    mol VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    dds VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    logo_url VARCHAR(255),
    vat_number VARCHAR(255) NOT NULL,
    iban VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_invoice_languages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(2) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tbl_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashedPassword VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    manager_id INT,
    creator_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES tbl_users(id),
    FOREIGN KEY (creator_id) REFERENCES tbl_users(id)
);

CREATE TABLE IF NOT EXISTS tbl_clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_company_name VARCHAR(255),
    client_name VARCHAR(255) NOT NULL,
    client_company_address VARCHAR(255),
    client_company_iban VARCHAR(255),
    client_emails JSON NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT "active",
    creator_id INT NOT NULL,
    client_company_vat_number VARCHAR(255),
    invoice_language_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES tbl_users(id),
    FOREIGN KEY (invoice_language_id) REFERENCES tbl_invoice_languages(id)
);

CREATE TABLE IF NOT EXISTS tbl_projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    company_id INT,
    company_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    note TEXT,
    status VARCHAR(50) NOT NULL,
    client_id INT,
    creator_id INT NOT NULL,
    FOREIGN KEY (company_id) REFERENCES tbl_companies(id),
    FOREIGN KEY (client_id) REFERENCES tbl_clients(id),
    FOREIGN KEY (creator_id) REFERENCES tbl_users(id)
);

CREATE TABLE IF NOT EXISTS tbl_artisans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    note TEXT NOT NULL,
    number VARCHAR(255),
    email VARCHAR(255),
    company_id INT,
    user_id INT,
    status VARCHAR(50) NOT NULL,
    activity_id INT,
    measure_id INT,
    default_pricing_id INT,
    FOREIGN KEY (company_id) REFERENCES tbl_companies(id),
    FOREIGN KEY (user_id) REFERENCES tbl_users(id),
    FOREIGN KEY (activity_id) REFERENCES tbl_activities(id),
    FOREIGN KEY (measure_id) REFERENCES tbl_measures(id)
);

CREATE TABLE IF NOT EXISTS tbl_default_pricing (
    id INT PRIMARY KEY AUTO_INCREMENT,
    activity_id INT NOT NULL,
    measure_id INT NOT NULL,
    project_id INT NOT NULL,
    manager_price DECIMAL(10,2) NOT NULL,
    artisan_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (activity_id) REFERENCES tbl_activities(id),
    FOREIGN KEY (measure_id) REFERENCES tbl_measures(id),
    FOREIGN KEY (project_id) REFERENCES tbl_projects(id)
);

CREATE TABLE IF NOT EXISTS tbl_tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    activity_id INT,
    measure_id INT,
    total_price DECIMAL(10,2) NOT NULL,
    total_work_in_selected_measure DECIMAL(10,2) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    note TEXT,
    status VARCHAR(50) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES tbl_projects(id),
    FOREIGN KEY (activity_id) REFERENCES tbl_activities(id),
    FOREIGN KEY (measure_id) REFERENCES tbl_measures(id)
);

CREATE TABLE IF NOT EXISTS tbl_task_artisans (
    task_id INT NOT NULL,
    artisan_id INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (task_id, artisan_id),
    FOREIGN KEY (task_id) REFERENCES tbl_tasks(id),
    FOREIGN KEY (artisan_id) REFERENCES tbl_artisans(id)
);

CREATE TABLE IF NOT EXISTS tbl_invoices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_number VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    week_number INT NOT NULL,
    company_id INT NOT NULL,
    client_id INT,
    invoice_date TIMESTAMP NOT NULL,
    due_date TIMESTAMP NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    is_artisan_invoice BOOLEAN NOT NULL DEFAULT FALSE,
    artisan_id INT,
    client_company_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES tbl_companies(id),
    FOREIGN KEY (client_id) REFERENCES tbl_clients(id),
    FOREIGN KEY (artisan_id) REFERENCES tbl_artisans(id),
    FOREIGN KEY (client_company_id) REFERENCES tbl_clients(id)
);

CREATE TABLE IF NOT EXISTS tbl_workitems (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    activity_id INT,
    measure_id INT,
    artisan_id INT,
    quantity DECIMAL(10,2) NOT NULL,
    note TEXT,
    finished_work TEXT,
    status VARCHAR(50) NOT NULL,
    is_client_invoiced BOOLEAN NOT NULL DEFAULT FALSE,
    is_artisan_invoiced BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tbl_tasks(id),
    FOREIGN KEY (activity_id) REFERENCES tbl_activities(id),
    FOREIGN KEY (measure_id) REFERENCES tbl_measures(id),
    FOREIGN KEY (artisan_id) REFERENCES tbl_artisans(id)
);

CREATE TABLE IF NOT EXISTS tbl_invoice_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_id INT NOT NULL,
    work_item_id INT NOT NULL,
    project_id INT NOT NULL,
    task_id INT NOT NULL,
    activity_id INT NOT NULL,
    measure_id INT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES tbl_invoices(id),
    FOREIGN KEY (work_item_id) REFERENCES tbl_workitems(id),
    FOREIGN KEY (project_id) REFERENCES tbl_projects(id),
    FOREIGN KEY (task_id) REFERENCES tbl_tasks(id),
    FOREIGN KEY (activity_id) REFERENCES tbl_activities(id),
    FOREIGN KEY (measure_id) REFERENCES tbl_measures(id)
);

-- Add indexes for better performance
ALTER TABLE tbl_invoices ADD INDEX idx_invoice_number (invoice_number);
ALTER TABLE tbl_invoices ADD INDEX idx_year_week (year, week_number);
ALTER TABLE tbl_workitems ADD INDEX idx_status (status);
ALTER TABLE tbl_tasks ADD INDEX idx_project_status (project_id, status);
ALTER TABLE tbl_projects ADD INDEX idx_company_status (company_id, status); 