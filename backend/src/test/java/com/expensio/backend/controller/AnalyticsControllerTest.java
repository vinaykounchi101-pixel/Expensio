package com.expensio.backend.controller;

import com.expensio.backend.dto.response.AnalyticsSummaryResponse;
import com.expensio.backend.dto.response.CategoryBreakdownResponse;
import com.expensio.backend.dto.response.SpendingTrendResponse;
import com.expensio.backend.enums.ExpenseCategory;
import com.expensio.backend.service.AnalyticsService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AnalyticsController.class)
class AnalyticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AnalyticsService analyticsService;

    @Test
    @DisplayName("GET /api/v1/analytics/summary — should return summary")
    void getSummary_shouldReturnSummary() throws Exception {
        AnalyticsSummaryResponse response = AnalyticsSummaryResponse.builder()
                .totalAmount(BigDecimal.valueOf(1000.00))
                .averageAmount(BigDecimal.valueOf(500.00))
                .build();

        when(analyticsService.getSummary(any(), any())).thenReturn(response);

        mockMvc.perform(get("/api/v1/analytics/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalAmount").value(1000.00))
                .andExpect(jsonPath("$.averageAmount").value(500.00));
    }

    @Test
    @DisplayName("GET /api/v1/analytics/breakdown — should return category breakdown")
    void getCategoryBreakdown_shouldReturnList() throws Exception {
        CategoryBreakdownResponse response = CategoryBreakdownResponse.builder()
                .category(ExpenseCategory.FOOD)
                .totalAmount(BigDecimal.valueOf(400.00))
                .percentOfTotal(40.0)
                .build();

        when(analyticsService.getCategoryBreakdown(any(), any())).thenReturn(List.of(response));

        mockMvc.perform(get("/api/v1/analytics/breakdown"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].category").value("FOOD"))
                .andExpect(jsonPath("$[0].totalAmount").value(400.00))
                .andExpect(jsonPath("$[0].percentOfTotal").value(40.0));
    }

    @Test
    @DisplayName("GET /api/v1/analytics/trend?granularity=monthly — should return monthly trend")
    void getSpendingTrend_monthly_shouldReturnSeries() throws Exception {
        SpendingTrendResponse response = SpendingTrendResponse.builder()
                .periodLabel("2026-08")
                .totalAmount(BigDecimal.valueOf(600.00))
                .build();

        when(analyticsService.getSpendingTrend(any(), any(), any())).thenReturn(List.of(response));

        mockMvc.perform(get("/api/v1/analytics/trend")
                        .param("granularity", "monthly"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].periodLabel").value("2026-08"))
                .andExpect(jsonPath("$[0].totalAmount").value(600.00));
    }
}
