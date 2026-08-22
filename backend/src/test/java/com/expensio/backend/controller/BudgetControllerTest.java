package com.expensio.backend.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * V3 — MockMvc integration tests for BudgetController.
 */
@SpringBootTest
@AutoConfigureMockMvc
class BudgetControllerTest {

    @Test
    @DisplayName("POST /api/v1/budgets — should create budget and return 201")
    void createBudget_shouldReturn201() {
        // TODO
    }

    @Test
    @DisplayName("POST /api/v1/budgets — duplicate budget should return 409")
    void createDuplicateBudget_shouldReturn409() {
        // TODO
    }

    @Test
    @DisplayName("GET /api/v1/budgets — should return budget list")
    void getBudgets_shouldReturnList() {
        // TODO
    }

    @Test
    @DisplayName("GET /api/v1/budgets/{id} — should return budget with utilization")
    void getBudgetById_shouldReturnWithUtilization() {
        // TODO
    }

    @Test
    @DisplayName("PUT /api/v1/budgets/{id} — should update budget amount")
    void updateBudget_shouldReturn200() {
        // TODO
    }

    @Test
    @DisplayName("DELETE /api/v1/budgets/{id} — should return 204")
    void deleteBudget_shouldReturn204() {
        // TODO
    }
}
