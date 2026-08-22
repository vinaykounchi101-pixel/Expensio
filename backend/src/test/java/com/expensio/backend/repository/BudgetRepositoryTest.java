package com.expensio.backend.repository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * V3 — Repository tests for BudgetRepository using Testcontainers + real Postgres.
 */
@DataJpaTest
@ActiveProfiles("test")
class BudgetRepositoryTest {

    @Test
    @DisplayName("existsByPeriodMonthAndCategory — should return true for existing budget")
    void existsByPeriodMonthAndCategory_shouldReturnTrue() {
        // TODO: use Testcontainers Postgres
    }

    @Test
    @DisplayName("findByPeriodMonth — should return budgets for given month")
    void findByPeriodMonth_shouldReturnBudgets() {
        // TODO
    }
}
