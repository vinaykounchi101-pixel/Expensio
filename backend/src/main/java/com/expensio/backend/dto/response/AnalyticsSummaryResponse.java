package com.expensio.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

/**
 * V3 — Analytics summary: total, average, highest, and lowest expense.
 */
@Data
@Builder
public class AnalyticsSummaryResponse {

    private BigDecimal totalAmount;
    private BigDecimal averageAmount;
    private ExpenseReference highestExpense;
    private ExpenseReference lowestExpense;

    @Data
    @Builder
    public static class ExpenseReference {
        private Long id;
        private String title;
        private BigDecimal amount;
    }
}
