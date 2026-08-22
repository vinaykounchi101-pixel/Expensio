package com.expensio.backend.service;

import com.expensio.backend.dto.response.AnalyticsSummaryResponse;
import com.expensio.backend.dto.response.CategoryBreakdownResponse;
import com.expensio.backend.dto.response.SpendingTrendResponse;

import java.time.LocalDate;
import java.util.List;

/**
 * V3 — Analytics service interface.
 * Read-only service — composes repository queries, no mutations.
 */
public interface AnalyticsService {

    AnalyticsSummaryResponse getSummary(LocalDate dateFrom, LocalDate dateTo);

    List<CategoryBreakdownResponse> getCategoryBreakdown(LocalDate dateFrom, LocalDate dateTo);

    List<SpendingTrendResponse> getSpendingTrend(String granularity, LocalDate dateFrom, LocalDate dateTo);
}
