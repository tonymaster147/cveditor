-- Email OTP verification for new signups.
-- Idempotent — safe to re-run on MySQL 8 / MariaDB 10.

USE cv_builder_db;

-- Add email_verified_at to users. Existing rows are backfilled to NOW()
-- so current accounts stay grandfathered (no forced re-verify).
SET @col_exists := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'email_verified_at');
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE users ADD COLUMN email_verified_at DATETIME NULL AFTER plan',
  'SELECT ''email_verified_at already exists''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Grandfather existing accounts (only those still NULL — re-runs are no-ops).
UPDATE users SET email_verified_at = NOW() WHERE email_verified_at IS NULL;

-- Pending signups awaiting OTP. One row per email (we replace on resend).
CREATE TABLE IF NOT EXISTS email_verifications (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  otp_hash        VARCHAR(255) NOT NULL,
  expires_at      DATETIME     NOT NULL,
  attempts        INT          NOT NULL DEFAULT 0,
  last_sent_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_expires (expires_at)
) ENGINE=InnoDB;
