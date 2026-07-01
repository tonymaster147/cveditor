-- Local-only seed: adds the 3 newest templates (Westminster, Bristol,
-- Edinburgh) at £3.99 each. Paste into phpMyAdmin (localhost) → SQL tab
-- and run. INSERT IGNORE means it's safe to re-run — nothing is updated
-- or deleted, only missing rows are inserted.
--
-- NOT for production. Prod DB should stay at 18 templates until you're
-- ready to publish the new ones live.

USE cv_builder_db;

INSERT IGNORE INTO templates (id, name, price_cents, currency) VALUES
  ('westminster', 'Westminster', 399, 'gbp'),
  ('bristol',     'Bristol',     399, 'gbp'),
  ('edinburgh',   'Edinburgh',   399, 'gbp');

SELECT id, name, price_cents, currency FROM templates ORDER BY id;
