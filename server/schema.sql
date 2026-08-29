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

-- Seed prices (GBP pence). All one-time downloads are £3.99 — change here
-- AND in phpMyAdmin if you want to override existing rows after a re-seed.
INSERT INTO templates (id, name, price_cents, currency) VALUES
  ('photo-sidebar',  'Photo Sidebar',   399, 'gbp'),
  ('photo-header',   'Photo Header',    399, 'gbp'),
  ('modern',         'Modern',          399, 'gbp'),
  ('stylish',        'Stylish',         399, 'gbp'),
  ('double',         'Double Column',   399, 'gbp'),
  ('classic',        'Classic',         399, 'gbp'),
  ('minimal',        'Minimal',         399, 'gbp'),
  ('creative',       'Creative Split',  399, 'gbp'),
  ('executive',      'Executive Suite', 399, 'gbp'),
  ('bold',           'Bold Header',     399, 'gbp'),
  ('timeline',       'Timeline',        399, 'gbp'),
  ('elegant',        'Elegant',         399, 'gbp'),
  ('pastel-studio',  'Pastel Studio',   399, 'gbp'),
  ('monogram-serif', 'Monogram Serif',  399, 'gbp'),
  ('centered-pro',   'Centered Pro',    399, 'gbp'),
  ('cambridge',      'Cambridge',       399, 'gbp'),
  ('greenwich',      'Greenwich',       399, 'gbp'),
  ('shoreditch',     'Shoreditch',      399, 'gbp'),
  ('westminster',    'Westminster',     399, 'gbp'),
  ('bristol',        'Bristol',         399, 'gbp'),
  ('edinburgh',      'Edinburgh',       399, 'gbp'),
  ('windsor',        'Windsor',         399, 'gbp'),
  ('york',           'York',            399, 'gbp'),
  ('mayfair',        'Mayfair',         399, 'gbp'),
  ('manchester',     'Manchester',      399, 'gbp'),
  ('bath',           'Bath',            399, 'gbp'),
  ('brighton',       'Brighton',        399, 'gbp'),
  ('chelsea',        'Chelsea',         399, 'gbp'),
  ('kensington',     'Kensington',      399, 'gbp'),
  ('soho',           'Soho',            399, 'gbp'),
  ('belgravia',      'Belgravia',       399, 'gbp'),
  ('marylebone',     'Marylebone',      399, 'gbp'),
  ('hampstead',      'Hampstead',       399, 'gbp'),
  ('chester',        'Chester',         399, 'gbp'),
  ('salisbury',      'Salisbury',       399, 'gbp'),
  ('ascot',          'Ascot',           399, 'gbp'),
  ('islington',      'Islington',       399, 'gbp'),
  ('dulwich',        'Dulwich',         399, 'gbp'),
  ('richmond',       'Richmond',        399, 'gbp'),
  ('notting',        'Notting',         399, 'gbp'),
  ('fulham',         'Fulham',          399, 'gbp'),
  ('chiswick',       'Chiswick',        399, 'gbp'),
  ('highgate',       'Highgate',        399, 'gbp'),
  ('camden',         'Camden',          399, 'gbp'),
  ('regent',         'Regent',          399, 'gbp'),
  ('barbican',       'Barbican',        399, 'gbp'),
  ('pimlico',        'Pimlico',         399, 'gbp'),
  ('kew',            'Kew',             399, 'gbp'),
  ('clapham',        'Clapham',         399, 'gbp'),
  ('battersea',      'Battersea',       399, 'gbp'),
  ('hampton',        'Hampton',         399, 'gbp'),
  ('ealing',         'Ealing',          399, 'gbp'),
  ('peckham',        'Peckham',         399, 'gbp'),
  ('hackney',        'Hackney',         399, 'gbp'),
  ('whitechapel',    'Whitechapel',     399, 'gbp'),
  ('wandsworth',     'Wandsworth',      399, 'gbp'),
  ('sutton',         'Sutton',          399, 'gbp'),
  ('lambeth',        'Lambeth',         399, 'gbp'),
  ('southwark',      'Southwark',       399, 'gbp'),
  ('twickenham',     'Twickenham',      399, 'gbp')
ON DUPLICATE KEY UPDATE name = VALUES(name);
