package com.expensio.backend.controller;

import com.expensio.backend.dto.response.AnalyticsSummaryResponse;
import com.expensio.backend.dto.response.CategoryBreakdownResponse;
import com.expensio.backend.dto.response.SpendingTrendResponse;
import com.expensio.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * V3 — Analytics REST controller mapping all SRS §10.2 endpoints.
 */
@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryResponse> getSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo) {
        return ResponseEntity.ok(analyticsService.getSummary(dateFrom, dateTo));
    }

    @GetMapping("/breakdown")
    public ResponseEntity<List<CategoryBreakdownResponse>> getCategoryBreakdown(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo) {
        return ResponseEntity.ok(analyticsService.getCategoryBreakdown(dateFrom, dateTo));
    }

    @GetMapping("/trend")
    public ResponseEntity<List<SpendingTrendResponse>> getSpendingTrend(
            @RequestParam(defaultValue = "monthly") String granularity,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo) {
        return ResponseEntity.ok(analyticsService.getSpendingTrend(granularity, dateFrom, dateTo));
    }
}
