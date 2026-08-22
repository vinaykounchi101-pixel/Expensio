package com.expensio.backend.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * V1 — MockMvc integration tests for ExpenseController.
 * Covers all CRUD endpoints, validation errors, and summary endpoint.
 * V2 additions: pagination edge cases, search/filter/sort params.
 */
@SpringBootTest
@AutoConfigureMockMvc
class ExpenseControllerTest {

    // TODO: inject MockMvc and mock ExpenseService

    @Test
    @DisplayName("POST /api/v1/expenses — should create expense and return 201")
    void createExpense_shouldReturn201() {
        // TODO
    }

    @Test
    @DisplayName("GET /api/v1/expenses — should return paged list")
    void getExpenses_shouldReturnPagedList() {
        // TODO
    }

    @Test
    @DisplayName("GET /api/v1/expenses/{id} — should return expense")
    void getExpenseById_shouldReturnExpense() {
        // TODO
    }

    @Test
    @DisplayName("PUT /api/v1/expenses/{id} — should update expense")
    void updateExpense_shouldReturn200() {
        // TODO
    }

    @Test
    @DisplayName("DELETE /api/v1/expenses/{id} — should return 204")
    void deleteExpense_shouldReturn204() {
        // TODO
    }

    @Test
    @DisplayName("GET /api/v1/expenses/summary — should return summary")
    void getSummary_shouldReturnSummary() {
        // TODO
    }

    @Test
    @DisplayName("POST /api/v1/expenses — invalid payload should return 400")
    void createExpense_invalidPayload_shouldReturn400() {
        // TODO
    }
}
