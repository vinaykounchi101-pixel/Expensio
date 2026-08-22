package com.expensio.backend.service;

import com.expensio.backend.dto.response.AnalyticsSummaryResponse;
import com.expensio.backend.dto.response.CategoryBreakdownResponse;
import com.expensio.backend.dto.response.SpendingTrendResponse;
import com.expensio.backend.entity.Expense;
import com.expensio.backend.enums.ExpenseCategory;
import com.expensio.backend.repository.ExpenseRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @InjectMocks
    private AnalyticsServiceImpl analyticsService;

    @Test
    @DisplayName("getSummary — should correctly return total, average, highest, lowest")
    void getSummary_shouldReturnCorrectAggregates() {
        Expense expense1 = new Expense();
        expense1.setId(1L);
        expense1.setTitle("Lunch");
        expense1.setAmount(BigDecimal.valueOf(100.00));
        expense1.setExpenseDate(LocalDate.now());

        Expense expense2 = new Expense();
        expense2.setId(2L);
        expense2.setTitle("Laptop");
        expense2.setAmount(BigDecimal.valueOf(900.00));
        expense2.setExpenseDate(LocalDate.now());

        when(expenseRepository.findAll(any(Specification.class))).thenReturn(List.of(expense1, expense2));

        AnalyticsSummaryResponse summary = analyticsService.getSummary(null, null);

        assertNotNull(summary);
        assertEquals(BigDecimal.valueOf(1000.00).setScale(2, RoundingMode.HALF_UP), summary.getTotalAmount());
        assertEquals(BigDecimal.valueOf(500.00).setScale(2, RoundingMode.HALF_UP), summary.getAverageAmount());
        assertEquals(2L, summary.getHighestExpense().getId());
        assertEquals(1L, summary.getLowestExpense().getId());
    }

    @Test
    @DisplayName("getCategoryBreakdown — percentOfTotal should sum to 100")
    void getCategoryBreakdown_percentShouldSumTo100() {
        Expense expense1 = new Expense();
        expense1.setCategory(ExpenseCategory.FOOD);
        expense1.setAmount(BigDecimal.valueOf(400.00));

        Expense expense2 = new Expense();
        expense2.setCategory(ExpenseCategory.TRANSPORT);
        expense2.setAmount(BigDecimal.valueOf(600.00));

        when(expenseRepository.findAll(any(Specification.class))).thenReturn(List.of(expense1, expense2));

        List<CategoryBreakdownResponse> breakdown = analyticsService.getCategoryBreakdown(null, null);

        assertNotNull(breakdown);
        assertEquals(2, breakdown.size());
        
        double totalPercent = breakdown.stream()
                .mapToDouble(CategoryBreakdownResponse::getPercentOfTotal)
                .sum();
        
        assertEquals(100.0, totalPercent, 0.0001);
    }

    @Test
    @DisplayName("getSpendingTrend — monthly granularity should group by month")
    void getSpendingTrend_monthly_shouldGroupByMonth() {
        Expense expense1 = new Expense();
        expense1.setExpenseDate(LocalDate.of(2026, 8, 15));
        expense1.setAmount(BigDecimal.valueOf(100.00));

        Expense expense2 = new Expense();
        expense2.setExpenseDate(LocalDate.of(2026, 8, 20));
        expense2.setAmount(BigDecimal.valueOf(200.00));

        Expense expense3 = new Expense();
        expense3.setExpenseDate(LocalDate.of(2026, 7, 5));
        expense3.setAmount(BigDecimal.valueOf(500.00));

        when(expenseRepository.findAll(any(Specification.class))).thenReturn(List.of(expense1, expense2, expense3));

        List<SpendingTrendResponse> trend = analyticsService.getSpendingTrend("monthly", null, null);

        assertNotNull(trend);
        assertEquals(2, trend.size()); // 2026-07 and 2026-08
        
        assertEquals("2026-07", trend.get(0).getPeriodLabel());
        assertEquals(BigDecimal.valueOf(500.00).setScale(2, RoundingMode.HALF_UP), trend.get(0).getTotalAmount());

        assertEquals("2026-08", trend.get(1).getPeriodLabel());
        assertEquals(BigDecimal.valueOf(300.00).setScale(2, RoundingMode.HALF_UP), trend.get(1).getTotalAmount());
    }
}
