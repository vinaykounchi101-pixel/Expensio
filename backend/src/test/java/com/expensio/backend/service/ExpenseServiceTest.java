package com.expensio.backend.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

/**
 * Unit tests for ExpenseService — mocked repositories, no DB required.
 */
@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    // TODO: inject service impl and mock ExpenseRepository / ExpenseMapper

    @Test
    @DisplayName("create — valid request should persist and return response")
    void create_validRequest_shouldReturnResponse() {
        // TODO
    }

    @Test
    @DisplayName("getById — existing id should return response")
    void getById_existingId_shouldReturnResponse() {
        // TODO
    }

    @Test
    @DisplayName("getById — missing id should throw ResourceNotFoundException")
    void getById_missingId_shouldThrow() {
        // TODO
    }

    @Test
    @DisplayName("delete — existing id should call repository delete")
    void delete_existingId_shouldDelete() {
        // TODO
    }

    @Test
    @DisplayName("getSummary — should aggregate total and count correctly")
    void getSummary_shouldReturnAggregates() {
        // TODO
    }
}
