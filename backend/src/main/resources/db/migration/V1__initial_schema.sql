-- V1__initial_schema.sql
-- Creates the expenses table with all V1 columns and initial indexes.

CREATE TABLE expenses (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title          VARCHAR(150)   NOT NULL,
    amount         NUMERIC(12,2)  NOT NULL CHECK (amount > 0),
    category       VARCHAR(30)    NOT NULL CHECK (category IN (
                        'FOOD','TRANSPORT','SHOPPING','BILLS',
                        'HEALTH','ENTERTAINMENT','OTHER')),
    expense_date   DATE           NOT NULL,
    description    VARCHAR(500),
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX idx_expenses_category     ON expenses (category);
CREATE INDEX idx_expenses_expense_date ON expenses (expense_date);
