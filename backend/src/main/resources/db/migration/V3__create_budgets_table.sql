-- V3__create_budgets_table.sql
-- Creates the budgets table for V3 budget management.
-- UNIQUE (period_month, category) enforces FR-3.7 at the DB level.
-- Note: Postgres treats NULL as distinct per row, so the service layer must
-- additionally check for an existing overall (null-category) budget before insert.

CREATE TABLE budgets (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    period_month   DATE           NOT NULL,
    category       VARCHAR(30)    CHECK (category IN (
                        'FOOD','TRANSPORT','SHOPPING','BILLS',
                        'HEALTH','ENTERTAINMENT','OTHER')),
    amount         NUMERIC(12,2)  NOT NULL CHECK (amount > 0),
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ    NOT NULL DEFAULT now(),
    CONSTRAINT uq_budget_period_category UNIQUE (period_month, category)
);

CREATE INDEX idx_budgets_period_month ON budgets (period_month);
