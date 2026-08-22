package com.expensio.backend.controller;

import com.expensio.backend.dto.request.CreateBudgetRequest;
import com.expensio.backend.dto.request.UpdateBudgetRequest;
import com.expensio.backend.dto.response.BudgetResponse;
import com.expensio.backend.enums.ExpenseCategory;
import com.expensio.backend.exception.DuplicateBudgetException;
import com.expensio.backend.exception.ResourceNotFoundException;
import com.expensio.backend.service.BudgetService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BudgetController.class)
class BudgetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BudgetService budgetService;

    @Test
    @DisplayName("POST /api/v1/budgets — should create budget and return 201")
    void createBudget_shouldReturn201() throws Exception {
        CreateBudgetRequest request = new CreateBudgetRequest();
        request.setAmount(BigDecimal.valueOf(1000.00));
        request.setCategory(ExpenseCategory.FOOD);
        request.setPeriodMonth(LocalDate.of(2026, 8, 1));

        BudgetResponse response = BudgetResponse.builder()
                .id(1L)
                .amount(BigDecimal.valueOf(1000.00))
                .category(ExpenseCategory.FOOD)
                .periodMonth(LocalDate.of(2026, 8, 1))
                .spent(BigDecimal.ZERO)
                .utilizationPercent(0.0)
                .build();

        when(budgetService.create(any(CreateBudgetRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/budgets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.amount").value(1000.00))
                .andExpect(jsonPath("$.utilizationPercent").value(0.0));
    }

    @Test
    @DisplayName("POST /api/v1/budgets — duplicate budget should return 409")
    void createDuplicateBudget_shouldReturn409() throws Exception {
        CreateBudgetRequest request = new CreateBudgetRequest();
        request.setAmount(BigDecimal.valueOf(1000.00));
        request.setCategory(ExpenseCategory.FOOD);
        request.setPeriodMonth(LocalDate.of(2026, 8, 1));

        when(budgetService.create(any(CreateBudgetRequest.class)))
                .thenThrow(new DuplicateBudgetException("Budget already exists"));

        mockMvc.perform(post("/api/v1/budgets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("GET /api/v1/budgets — should return budget list")
    void getBudgets_shouldReturnList() throws Exception {
        BudgetResponse response = BudgetResponse.builder()
                .id(1L)
                .amount(BigDecimal.valueOf(1000.00))
                .build();

        when(budgetService.getAll(any())).thenReturn(List.of(response));

        mockMvc.perform(get("/api/v1/budgets")
                        .param("periodMonth", "2026-08-01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].amount").value(1000.00));
    }

    @Test
    @DisplayName("GET /api/v1/budgets/{id} — should return budget with utilization")
    void getBudgetById_shouldReturnWithUtilization() throws Exception {
        Long id = 1L;
        BudgetResponse response = BudgetResponse.builder()
                .id(id)
                .amount(BigDecimal.valueOf(1000.00))
                .spent(BigDecimal.valueOf(500.00))
                .utilizationPercent(50.0)
                .build();

        when(budgetService.getById(id)).thenReturn(response);

        mockMvc.perform(get("/api/v1/budgets/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.utilizationPercent").value(50.0));
    }

    @Test
    @DisplayName("PUT /api/v1/budgets/{id} — should update budget amount")
    void updateBudget_shouldReturn200() throws Exception {
        Long id = 1L;
        UpdateBudgetRequest request = new UpdateBudgetRequest();
        request.setAmount(BigDecimal.valueOf(1200.00));

        BudgetResponse response = BudgetResponse.builder()
                .id(id)
                .amount(BigDecimal.valueOf(1200.00))
                .build();

        when(budgetService.update(eq(id), any(UpdateBudgetRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/v1/budgets/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.amount").value(1200.00));
    }

    @Test
    @DisplayName("DELETE /api/v1/budgets/{id} — should return 204")
    void deleteBudget_shouldReturn204() throws Exception {
        Long id = 1L;
        doNothing().when(budgetService).delete(id);

        mockMvc.perform(delete("/api/v1/budgets/{id}", id))
                .andExpect(status().isNoContent());

        verify(budgetService, times(1)).delete(id);
    }
}
