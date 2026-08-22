package com.expensio.backend.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

/**
 * V3 — Unit tests for AnalyticsService — aggregation correctness against known fixtures.
 */
@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Test
    @DisplayName("getSummary — should correctly return total, average, highest, lowest")
    void getSummary_shouldReturnCorrectAggregates() {
        // TODO
    }

    @Test
    @DisplayName("getCategoryBreakdown — percentOfTotal should sum to 100")
    void getCategoryBreakdown_percentShouldSumTo100() {
        // TODO
    }

    @Test
    @DisplayName("getSpendingTrend — monthly granularity should group by month")
    void getSpendingTrend_monthly_shouldGroupByMonth() {
        // TODO
    }
}
