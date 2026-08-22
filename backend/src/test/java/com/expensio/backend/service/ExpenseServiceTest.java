package com.expensio.backend.service;

import com.expensio.backend.dto.request.CreateExpenseRequest;
import com.expensio.backend.dto.response.ExpenseResponse;
import com.expensio.backend.dto.response.ExpenseSummaryResponse;
import com.expensio.backend.entity.Expense;
import com.expensio.backend.enums.ExpenseCategory;
import com.expensio.backend.exception.ResourceNotFoundException;
import com.expensio.backend.mapper.ExpenseMapper;
import com.expensio.backend.repository.ExpenseRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private ExpenseMapper expenseMapper;

    @InjectMocks
    private ExpenseServiceImpl expenseService;

    @Test
    @DisplayName("create — valid request should persist and return response")
    void create_validRequest_shouldReturnResponse() {
        CreateExpenseRequest request = new CreateExpenseRequest();
        request.setTitle("Groceries");
        request.setAmount(BigDecimal.valueOf(150.0));
        request.setCategory(ExpenseCategory.FOOD);
        request.setExpenseDate(LocalDate.now());

        Expense expense = new Expense();
        Expense savedExpense = new Expense();
        ExpenseResponse response = ExpenseResponse.builder().id(1L).title("Groceries").build();

        when(expenseMapper.toEntity(request)).thenReturn(expense);
        when(expenseRepository.save(expense)).thenReturn(savedExpense);
        when(expenseMapper.toResponse(savedExpense)).thenReturn(response);

        ExpenseResponse result = expenseService.create(request);

        assertNotNull(result);
        assertEquals(response.getId(), result.getId());
        verify(expenseRepository, times(1)).save(expense);
    }

    @Test
    @DisplayName("getById — existing id should return response")
    void getById_existingId_shouldReturnResponse() {
        Long id = 1L;
        Expense expense = new Expense();
        ExpenseResponse response = ExpenseResponse.builder().id(id).title("Uber").build();

        when(expenseRepository.findById(id)).thenReturn(Optional.of(expense));
        when(expenseMapper.toResponse(expense)).thenReturn(response);

        ExpenseResponse result = expenseService.getById(id);

        assertNotNull(result);
        assertEquals(id, result.getId());
    }

    @Test
    @DisplayName("getById — missing id should throw ResourceNotFoundException")
    void getById_missingId_shouldThrow() {
        Long id = 99L;
        when(expenseRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> expenseService.getById(id));
    }

    @Test
    @DisplayName("delete — existing id should call repository delete")
    void delete_existingId_shouldDelete() {
        Long id = 1L;
        when(expenseRepository.existsById(id)).thenReturn(true);

        expenseService.delete(id);

        verify(expenseRepository, times(1)).deleteById(id);
    }

    @Test
    @DisplayName("delete — missing id should throw ResourceNotFoundException")
    void delete_missingId_shouldThrow() {
        Long id = 99L;
        when(expenseRepository.existsById(id)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> expenseService.delete(id));
        verify(expenseRepository, never()).deleteById(any());
    }

    @Test
    @DisplayName("getSummary — should aggregate total and count correctly")
    void getSummary_shouldReturnAggregates() {
        Expense expense1 = new Expense();
        expense1.setAmount(BigDecimal.valueOf(100.00));
        Expense expense2 = new Expense();
        expense2.setAmount(BigDecimal.valueOf(50.00));

        when(expenseRepository.findAll(any(Specification.class))).thenReturn(List.of(expense1, expense2));

        ExpenseSummaryResponse summary = expenseService.getSummary(ExpenseCategory.FOOD, LocalDate.now());

        assertNotNull(summary);
        assertEquals(BigDecimal.valueOf(150.00), summary.getTotalAmount());
        assertEquals(2, summary.getTotalCount());
    }
}
