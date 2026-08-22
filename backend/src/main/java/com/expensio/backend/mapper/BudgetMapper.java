package com.expensio.backend.mapper;

import com.expensio.backend.dto.request.CreateBudgetRequest;
import com.expensio.backend.dto.response.BudgetResponse;
import com.expensio.backend.entity.Budget;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * V3 — Budget entity ↔ DTO mapper.
 * Utilization fields (spent, remaining, utilizationPercent) are computed
 * and passed in from BudgetService — the mapper does not query the DB.
 */
@Component
public class BudgetMapper {

    public Budget toEntity(CreateBudgetRequest request) {
        return Budget.builder()
                .periodMonth(request.getPeriodMonth())
                .category(request.getCategory())
                .amount(request.getAmount())
                .build();
    }

    public BudgetResponse toResponse(Budget budget, BigDecimal spent) {
        BigDecimal remaining = budget.getAmount().subtract(spent);
        double utilizationPercent = budget.getAmount().compareTo(BigDecimal.ZERO) == 0
                ? 0.0
                : spent.divide(budget.getAmount(), 4, RoundingMode.HALF_UP)
                       .multiply(BigDecimal.valueOf(100))
                       .doubleValue();

        return BudgetResponse.builder()
                .id(budget.getId())
                .periodMonth(budget.getPeriodMonth())
                .category(budget.getCategory())
                .amount(budget.getAmount())
                .spent(spent)
                .remaining(remaining)
                .utilizationPercent(utilizationPercent)
                .createdAt(budget.getCreatedAt())
                .updatedAt(budget.getUpdatedAt())
                .build();
    }
}
