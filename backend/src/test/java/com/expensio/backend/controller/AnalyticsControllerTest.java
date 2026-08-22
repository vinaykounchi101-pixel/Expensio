package com.expensio.backend.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * V3 — MockMvc integration tests for AnalyticsController.
 */
@SpringBootTest
@AutoConfigureMockMvc
class AnalyticsControllerTest {

    @Test
    @DisplayName("GET /api/v1/analytics/summary — should return summary")
    void getSummary_shouldReturnSummary() {
        // TODO
    }

    @Test
    @DisplayName("GET /api/v1/analytics/breakdown — should return category breakdown")
    void getCategoryBreakdown_shouldReturnList() {
        // TODO
    }

    @Test
    @DisplayName("GET /api/v1/analytics/trend?granularity=monthly — should return monthly trend")
    void getSpendingTrend_monthly_shouldReturnSeries() {
        // TODO
    }
}
