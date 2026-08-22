package com.expensio.backend.repository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * V3 — Repository integration tests for BudgetRepository.
 * Require a live Postgres instance.
 * Tests are skipped automatically when DB_URL is not set as a system env var.
 */
@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@EnabledIfEnvironmentVariable(named = "DB_URL", matches = ".*")
class BudgetRepositoryTest {

    @Test
    @DisplayName("existsByPeriodMonthAndCategory — should return true for existing budget")
    void existsByPeriodMonthAndCategory_shouldReturnTrue() {
        // TODO: implement with TestEntityManager once CI DB is available
    }

    @Test
    @DisplayName("findByPeriodMonth — should return budgets for given month")
    void findByPeriodMonth_shouldReturnBudgets() {
        // TODO
    }
}
