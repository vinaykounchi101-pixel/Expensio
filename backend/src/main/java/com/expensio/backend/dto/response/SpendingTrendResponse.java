package com.expensio.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

/**
 * V3 — A single data point in a spending trend time series.
 * periodLabel format depends on granularity:
 *   daily   → "2026-08-20"
 *   weekly  → "2026-W34"
 *   monthly → "2026-08"
 */
@Data
@Builder
public class SpendingTrendResponse {

    private String periodLabel;
    private BigDecimal totalAmount;
}
