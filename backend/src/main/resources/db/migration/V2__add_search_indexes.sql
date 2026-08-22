-- V2__add_search_indexes.sql
-- Adds indexes to support V2 free-text search, amount-range, and sort queries.
-- Requires the pg_trgm extension for trigram-based LIKE search on title.
-- Confirm pg_trgm is available on the target Postgres host before running in production.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_expenses_amount      ON expenses (amount);
CREATE INDEX idx_expenses_title_trgm  ON expenses USING gin (title gin_trgm_ops);
