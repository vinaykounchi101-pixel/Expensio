package com.expensio.backend.repository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Repository tests using Testcontainers + real Postgres.
 * Covers ExpenseSpecification search/filter/sort combinations.
 */
@DataJpaTest
@ActiveProfiles("test")
class ExpenseRepositoryTest {

    @Test
    @DisplayName("findAll with category spec — should filter by category")
    void findAll_withCategorySpec_shouldFilter() {
        // TODO: use Testcontainers Postgres
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
