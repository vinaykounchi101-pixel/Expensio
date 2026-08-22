package com.expensio.backend.controller;

import com.expensio.backend.dto.request.CreateExpenseRequest;
import com.expensio.backend.dto.request.UpdateExpenseRequest;
import com.expensio.backend.dto.response.ExpenseResponse;
import com.expensio.backend.dto.response.ExpenseSummaryResponse;
import com.expensio.backend.dto.response.PagedResponse;
import com.expensio.backend.enums.ExpenseCategory;
import com.expensio.backend.exception.ResourceNotFoundException;
import com.expensio.backend.service.ExpenseService;
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

@WebMvcTest(ExpenseController.class)
class ExpenseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ExpenseService expenseService;

    @Test
    @DisplayName("POST /api/v1/expenses — should create expense and return 201")
    void createExpense_shouldReturn201() throws Exception {
        CreateExpenseRequest request = new CreateExpenseRequest();
        request.setTitle("Dinner");
        request.setAmount(BigDecimal.valueOf(150.00));
        request.setCategory(ExpenseCategory.FOOD);
        request.setExpenseDate(LocalDate.now());

        ExpenseResponse response = ExpenseResponse.builder()
                .id(1L)
                .title("Dinner")
                .amount(BigDecimal.valueOf(150.00))
                .category(ExpenseCategory.FOOD)
                .expenseDate(LocalDate.now())
                .build();

        when(expenseService.create(any(CreateExpenseRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("Dinner"))
                .andExpect(jsonPath("$.amount").value(150.00));
    }

    @Test
    @DisplayName("GET /api/v1/expenses — should return paged list")
    void getExpenses_shouldReturnPagedList() throws Exception {
        PagedResponse<ExpenseResponse> pagedResponse = PagedResponse.<ExpenseResponse>builder()
                .content(List.of(ExpenseResponse.builder().id(1L).title("Uber").build()))
                .page(0)
                .size(20)
                .totalElements(1L)
                .totalPages(1)
                .build();

        when(expenseService.search(any())).thenReturn(pagedResponse);

        mockMvc.perform(get("/api/v1/expenses")
                        .param("page", "0")
                        .param("size", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Uber"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    @DisplayName("GET /api/v1/expenses/{id} — should return expense")
    void getExpenseById_shouldReturnExpense() throws Exception {
        Long id = 1L;
        ExpenseResponse response = ExpenseResponse.builder().id(id).title("Bills").build();

        when(expenseService.getById(id)).thenReturn(response);

        mockMvc.perform(get("/api/v1/expenses/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.title").value("Bills"));
    }

    @Test
    @DisplayName("GET /api/v1/expenses/{id} — missing resource should return 404")
    void getExpenseById_missing_shouldReturn404() throws Exception {
        Long id = 99L;
        when(expenseService.getById(id)).thenThrow(new ResourceNotFoundException("Expense", id));

        mockMvc.perform(get("/api/v1/expenses/{id}", id))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("PUT /api/v1/expenses/{id} — should update expense")
    void updateExpense_shouldReturn200() throws Exception {
        Long id = 1L;
        UpdateExpenseRequest request = new UpdateExpenseRequest();
        request.setTitle("New Title");
        request.setAmount(BigDecimal.valueOf(20.00));
        request.setCategory(ExpenseCategory.OTHER);
        request.setExpenseDate(LocalDate.now());

        ExpenseResponse response = ExpenseResponse.builder().id(id).title("New Title").build();

        when(expenseService.update(eq(id), any(UpdateExpenseRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/v1/expenses/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("New Title"));
    }

    @Test
    @DisplayName("DELETE /api/v1/expenses/{id} — should return 204")
    void deleteExpense_shouldReturn204() throws Exception {
        Long id = 1L;
        doNothing().when(expenseService).delete(id);

        mockMvc.perform(delete("/api/v1/expenses/{id}", id))
                .andExpect(status().isNoContent());

        verify(expenseService, times(1)).delete(id);
    }

    @Test
    @DisplayName("GET /api/v1/expenses/summary — should return summary")
    void getSummary_shouldReturnSummary() throws Exception {
        ExpenseSummaryResponse summary = ExpenseSummaryResponse.builder()
                .totalAmount(BigDecimal.valueOf(500.00))
                .totalCount(5L)
                .build();

        when(expenseService.getSummary(eq(ExpenseCategory.FOOD), any())).thenReturn(summary);

        mockMvc.perform(get("/api/v1/expenses/summary")
                        .param("category", "FOOD"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalAmount").value(500.00))
                .andExpect(jsonPath("$.totalCount").value(5));
    }

    @Test
    @DisplayName("POST /api/v1/expenses — invalid payload should return 400")
    void createExpense_invalidPayload_shouldReturn400() throws Exception {
        CreateExpenseRequest request = new CreateExpenseRequest();
        request.setTitle(""); // invalid
        request.setAmount(BigDecimal.valueOf(-5.00)); // invalid

        mockMvc.perform(post("/api/v1/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
