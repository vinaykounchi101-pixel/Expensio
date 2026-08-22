package com.expensio.backend.dto.request;

import com.expensio.backend.enums.ExpenseCategory;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * V3 — Request DTO for creating a new budget.
 * category == null means an overall (all-category) budget.
 * periodMonth must be the first day of the desired month.
 */
@Data
public class CreateBudgetRequest {

    @NotNull(message = "Period month is required")
    private LocalDate periodMonth;

    /** Null = overall budget; a specific value scopes the budget to one category. */
    private ExpenseCategory category;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", inclusive = true, message = "Amount must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Amount must have at most 2 decimal places")
    private BigDecimal amount;
}
