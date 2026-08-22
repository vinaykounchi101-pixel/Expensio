package com.expensio.backend.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

/**
 * V3 — Unit tests for BudgetService — mocked repositories.
 * Key scenarios: utilization math, duplicate-budget rejection (FR-3.7).
 */
@ExtendWith(MockitoExtension.class)
class BudgetServiceTest {

    @Test
    @DisplayName("create — no duplicate should persist budget")
    void create_noDuplicate_shouldPersist() {
        // TODO
    }

    @Test
    @DisplayName("create — duplicate period+category should throw DuplicateBudgetException")
    void create_duplicate_shouldThrow() {
        // TODO
    }

    @Test
    @DisplayName("getById — should compute utilization correctly")
    void getById_shouldComputeUtilization() {
        // TODO
    }
}
