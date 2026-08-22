package com.expensio.backend.dto.response;

import com.expensio.backend.enums.ExpenseCategory;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Data
@Builder
public class ExpenseResponse {

    private Long id;
    private String title;
    private BigDecimal amount;
    private ExpenseCategory category;
    private LocalDate expenseDate;
    private String description;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
