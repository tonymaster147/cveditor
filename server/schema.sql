-- Run this once in phpMyAdmin (http://localhost/phpmyadmin/).
-- Creates the database, tables, and seeds prices for each CV template.

CREATE DATABASE IF NOT EXISTS cv_builder_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE cv_builder_db;

CREATE TABLE IF NOT EXISTS templates (
  id           VARCHAR(64)  PRIMARY KEY,
  name         VARCHAR(128) NOT NULL,
  price_cents  INT          NOT NULL,
  currency     VARCHAR(8)   NOT NULL DEFAULT 'gbp'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payments (
  id                       INT AUTO_INCREMENT PRIMARY KEY,
  stripe_payment_intent_id VARCHAR(128) UNIQUE NOT NULL,
  template_id              VARCHAR(64)  NOT NULL,
  amount_cents             INT          NOT NULL,
  currency                 VARCHAR(8)   NOT NULL,
  status                   ENUM('pending','succeeded','failed') NOT NULL DEFAULT 'pending',
  download_token           VARCHAR(128) UNIQUE,
  token_consumed_at        DATETIME     NULL,
  customer_email           VARCHAR(255) NULL,
  customer_name            VARCHAR(255) NULL,
  customer_phone           VARCHAR(64)  NULL,
  address_line1            VARCHAR(255) NULL,
  address_line2            VARCHAR(255) NULL,
  address_city             VARCHAR(128) NULL,
  address_state            VARCHAR(128) NULL,
  address_postal_code      VARCHAR(32)  NULL,
  address_country          VARCHAR(8)   NULL,
  created_at               DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at               DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_template (template_id),
  INDEX idx_status   (status)
) ENGINE=InnoDB;

-- Seed prices (GBP pence). Edit later in phpMyAdmin.
INSERT INTO templates (id, name, price_cents, currency) VALUES
  ('photo-sidebar',  'Photo Sidebar',   349, 'gbp'),
  ('photo-header',   'Photo Header',    299, 'gbp'),
  ('modern',         'Modern',          199, 'gbp'),
  ('stylish',        'Stylish',         249, 'gbp'),
  ('double',         'Double Column',   299, 'gbp'),
  ('classic',        'Classic',         149, 'gbp'),
  ('minimal',        'Minimal',         149, 'gbp'),
  ('creative',       'Creative Split',  349, 'gbp'),
  ('executive',      'Executive Suite', 399, 'gbp'),
  ('bold',           'Bold Header',     199, 'gbp'),
  ('timeline',       'Timeline',        249, 'gbp'),
  ('elegant',        'Elegant',         299, 'gbp')
ON DUPLICATE KEY UPDATE name = VALUES(name);
