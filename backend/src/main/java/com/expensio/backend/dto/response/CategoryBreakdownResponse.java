package com.expensio.backend.dto.response;

import com.expensio.backend.enums.ExpenseCategory;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

/**
 * V3 — Category-wise spending breakdown entry.
 */
@Data
@Builder
public class CategoryBreakdownResponse {

    private ExpenseCategory category;
    private BigDecimal totalAmount;
    private double percentOfTotal;
}
