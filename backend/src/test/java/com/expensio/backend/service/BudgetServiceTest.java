package com.expensio.backend.service;

import com.expensio.backend.dto.request.CreateBudgetRequest;
import com.expensio.backend.dto.response.BudgetResponse;
import com.expensio.backend.entity.Budget;
import com.expensio.backend.enums.ExpenseCategory;
import com.expensio.backend.exception.DuplicateBudgetException;
import com.expensio.backend.exception.ResourceNotFoundException;
import com.expensio.backend.mapper.BudgetMapper;
import com.expensio.backend.repository.BudgetRepository;
import com.expensio.backend.repository.ExpenseRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BudgetServiceTest {

    @Mock
    private BudgetRepository budgetRepository;

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private BudgetMapper budgetMapper;

    @InjectMocks
    private BudgetServiceImpl budgetService;

    @Test
    @DisplayName("create — no duplicate should persist budget")
    void create_noDuplicate_shouldPersist() {
        LocalDate month = LocalDate.of(2026, 8, 1);
        CreateBudgetRequest request = new CreateBudgetRequest();
        request.setAmount(BigDecimal.valueOf(1000.00));
        request.setCategory(ExpenseCategory.FOOD);
        request.setPeriodMonth(month);

        Budget budget = new Budget();
        Budget savedBudget = new Budget();
        savedBudget.setPeriodMonth(month);
        savedBudget.setCategory(ExpenseCategory.FOOD);

        BudgetResponse response = BudgetResponse.builder()
                .id(1L)
                .amount(BigDecimal.valueOf(1000.00))
                .spent(BigDecimal.valueOf(200.00))
                .utilizationPercent(20.0)
                .build();

        when(budgetRepository.existsByPeriodMonthAndCategory(month, ExpenseCategory.FOOD)).thenReturn(false);
        when(budgetMapper.toEntity(request)).thenReturn(budget);
        when(budgetRepository.save(budget)).thenReturn(savedBudget);
        when(expenseRepository.sumByDateRangeAndCategory(any(), any(), eq(ExpenseCategory.FOOD))).thenReturn(BigDecimal.valueOf(200.00));
        when(budgetMapper.toResponse(savedBudget, BigDecimal.valueOf(200.00))).thenReturn(response);

        BudgetResponse result = budgetService.create(request);

        assertNotNull(result);
        assertEquals(response.getId(), result.getId());
        verify(budgetRepository, times(1)).save(budget);
    }

    @Test
    @DisplayName("create — duplicate period+category should throw DuplicateBudgetException")
    void create_duplicate_shouldThrow() {
        LocalDate month = LocalDate.of(2026, 8, 1);
        CreateBudgetRequest request = new CreateBudgetRequest();
        request.setAmount(BigDecimal.valueOf(1000.00));
        request.setCategory(ExpenseCategory.FOOD);
        request.setPeriodMonth(month);

        when(budgetRepository.existsByPeriodMonthAndCategory(month, ExpenseCategory.FOOD)).thenReturn(true);

        assertThrows(DuplicateBudgetException.class, () -> budgetService.create(request));
        verify(budgetRepository, never()).save(any());
    }

    @Test
    @DisplayName("getById — should compute utilization correctly")
    void getById_shouldComputeUtilization() {
        Long id = 1L;
        LocalDate month = LocalDate.of(2026, 8, 1);
        Budget budget = new Budget();
        budget.setId(id);
        budget.setPeriodMonth(month);
        budget.setCategory(null); // overall

        BudgetResponse response = BudgetResponse.builder()
                .id(id)
                .amount(BigDecimal.valueOf(1000.00))
                .spent(BigDecimal.valueOf(600.00))
                .utilizationPercent(60.0)
                .build();

        when(budgetRepository.findById(id)).thenReturn(Optional.of(budget));
        when(expenseRepository.sumByDateRangeAndCategory(any(), any(), isNull())).thenReturn(BigDecimal.valueOf(600.00));
        when(budgetMapper.toResponse(budget, BigDecimal.valueOf(600.00))).thenReturn(response);

        BudgetResponse result = budgetService.getById(id);

        assertNotNull(result);
        assertEquals(60.0, result.getUtilizationPercent());
    }
}
