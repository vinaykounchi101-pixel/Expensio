package com.expensio.backend.dto.response;

import com.expensio.backend.enums.ExpenseCategory;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

/**
 * V3 — Budget response, including computed utilization fields.
 */
@Data
@Builder
public class BudgetResponse {

    private Long id;
    private LocalDate periodMonth;
    private ExpenseCategory category;   // null = overall budget
    private BigDecimal amount;
    private BigDecimal spent;
    private BigDecimal remaining;
    private double utilizationPercent;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
