-- Phase 2 migration: add lifetime-plan support to payments.
-- Idempotent — safe to re-run on MySQL 8.x or MariaDB 10.x.

USE cv_builder_db;

-- purchase_kind: ENUM distinguishing one-time downloads from lifetime upgrades.
SET @col_exists := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'purchase_kind');
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE payments ADD COLUMN purchase_kind ENUM(''one_time'', ''lifetime'') NOT NULL DEFAULT ''one_time'' AFTER currency',
  'SELECT ''purchase_kind already exists''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- user_id: link a payment to a logged-in user (null for guest checkouts).
SET @col_exists := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'user_id');
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE payments ADD COLUMN user_id INT NULL AFTER purchase_kind',
  'SELECT ''user_id already exists''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Indexes (also gated so re-running doesn't error).
SET @idx_exists := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND INDEX_NAME = 'idx_user');
SET @sql := IF(@idx_exists = 0, 'ALTER TABLE payments ADD INDEX idx_user (user_id)', 'SELECT ''idx_user exists''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx_exists := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND INDEX_NAME = 'idx_purchase_kind');
SET @sql := IF(@idx_exists = 0, 'ALTER TABLE payments ADD INDEX idx_purchase_kind (purchase_kind)', 'SELECT ''idx_purchase_kind exists''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- For lifetime purchases there's no specific template, so template_id can be NULL.
ALTER TABLE payments MODIFY COLUMN template_id VARCHAR(64) NULL;
