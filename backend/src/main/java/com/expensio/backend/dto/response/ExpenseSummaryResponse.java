package com.expensio.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ExpenseSummaryResponse {

    private BigDecimal totalAmount;
    private long totalCount;
}
