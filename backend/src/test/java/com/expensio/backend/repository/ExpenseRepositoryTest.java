package com.expensio.backend.repository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Repository integration tests — require a live Postgres instance.
 * Tests are skipped automatically when DB_URL is not set as a system env var.
 * In CI, set DB_URL/DB_USERNAME/DB_PASSWORD as environment variables.
 */
@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@EnabledIfEnvironmentVariable(named = "DB_URL", matches = ".*")
class ExpenseRepositoryTest {

    @Test
    @DisplayName("findAll with category spec — should filter by category")
    void findAll_withCategorySpec_shouldFilter() {
        // TODO: implement with TestEntityManager once CI DB is available
    }

    @Test
    @DisplayName("findAll with date range spec — should filter correctly")
    void findAll_withDateRange_shouldFilter() {
        // TODO
    }

    @Test
    @DisplayName("findAll with free-text search spec — should match title")
    void findAll_withQuery_shouldMatchTitle() {
        // TODO
    }
}
