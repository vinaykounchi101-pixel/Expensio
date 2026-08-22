package com.expensio.backend.dto.request;

import com.expensio.backend.enums.ExpenseCategory;
import com.expensio.backend.enums.SortDirection;
import com.expensio.backend.enums.SortField;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * V2 — Encapsulates all search, filter, sort, and pagination parameters
 * for GET /expenses.
 */
@Data
public class ExpenseSearchRequest {

    /** Free-text search on title and description. */
    @Size(max = 200, message = "Search query must not exceed 200 characters")
    private String q;

    private ExpenseCategory category;

    private LocalDate date;         // V1 exact-date filter (still supported)
    private LocalDate dateFrom;     // V2 range start
    private LocalDate dateTo;       // V2 range end

    @DecimalMin(value = "0.0", inclusive = true, message = "amountMin must be >= 0")
    private BigDecimal amountMin;

    @DecimalMin(value = "0.0", inclusive = true, message = "amountMax must be >= 0")
    private BigDecimal amountMax;

    private SortField sortBy;
    private SortDirection sortDir;

    @Min(value = 0, message = "Page number must be >= 0")
    private Integer page;

    @Min(value = 1, message = "Page size must be >= 1")
    @Max(value = 100, message = "Page size must be <= 100")
    private Integer size;
}
