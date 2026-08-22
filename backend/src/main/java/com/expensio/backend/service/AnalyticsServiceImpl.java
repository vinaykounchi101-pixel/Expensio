package com.expensio.backend.service;

import com.expensio.backend.dto.response.AnalyticsSummaryResponse;
import com.expensio.backend.dto.response.CategoryBreakdownResponse;
import com.expensio.backend.dto.response.SpendingTrendResponse;
import com.expensio.backend.entity.Expense;
import com.expensio.backend.enums.ExpenseCategory;
import com.expensio.backend.repository.ExpenseRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsServiceImpl implements AnalyticsService {

    private final ExpenseRepository expenseRepository;

    @Override
    public AnalyticsSummaryResponse getSummary(LocalDate dateFrom, LocalDate dateTo) {
        Specification<Expense> spec = dateRangeSpec(dateFrom, dateTo);
        List<Expense> expenses = expenseRepository.findAll(spec);

        if (expenses.isEmpty()) {
            return AnalyticsSummaryResponse.builder()
                    .totalAmount(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP))
                    .averageAmount(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP))
                    .highestExpense(null)
                    .lowestExpense(null)
                    .build();
        }

        BigDecimal totalAmount = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal averageAmount = totalAmount.divide(
                BigDecimal.valueOf(expenses.size()), 2, RoundingMode.HALF_UP);

        Expense highest = expenses.stream()
                .max(Comparator.comparing(Expense::getAmount))
                .orElseThrow();

        Expense lowest = expenses.stream()
                .min(Comparator.comparing(Expense::getAmount))
                .orElseThrow();

        return AnalyticsSummaryResponse.builder()
                .totalAmount(totalAmount.setScale(2, RoundingMode.HALF_UP))
                .averageAmount(averageAmount)
                .highestExpense(AnalyticsSummaryResponse.ExpenseReference.builder()
                        .id(highest.getId())
                        .title(highest.getTitle())
                        .amount(highest.getAmount())
                        .build())
                .lowestExpense(AnalyticsSummaryResponse.ExpenseReference.builder()
                        .id(lowest.getId())
                        .title(lowest.getTitle())
                        .amount(lowest.getAmount())
                        .build())
                .build();
    }

    @Override
    public List<CategoryBreakdownResponse> getCategoryBreakdown(LocalDate dateFrom, LocalDate dateTo) {
        Specification<Expense> spec = dateRangeSpec(dateFrom, dateTo);
        List<Expense> expenses = expenseRepository.findAll(spec);

        if (expenses.isEmpty()) {
            return Collections.emptyList();
        }

        BigDecimal totalAmount = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<ExpenseCategory, BigDecimal> categorySums = expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Expense::getAmount, BigDecimal::add)
                ));

        return categorySums.entrySet().stream()
                .map(entry -> {
                    BigDecimal categoryTotal = entry.getValue();
                    double percent = totalAmount.compareTo(BigDecimal.ZERO) == 0
                            ? 0.0
                            : categoryTotal.divide(totalAmount, 4, RoundingMode.HALF_UP)
                                   .multiply(BigDecimal.valueOf(100))
                                   .doubleValue();

                    return CategoryBreakdownResponse.builder()
                            .category(entry.getKey())
                            .totalAmount(categoryTotal.setScale(2, RoundingMode.HALF_UP))
                            .percentOfTotal(percent)
                            .build();
                })
                .sorted(Comparator.comparing(CategoryBreakdownResponse::getTotalAmount).reversed())
                .collect(Collectors.toList());
    }

    @Override
    public List<SpendingTrendResponse> getSpendingTrend(String granularity, LocalDate dateFrom, LocalDate dateTo) {
        Specification<Expense> spec = dateRangeSpec(dateFrom, dateTo);
        List<Expense> expenses = expenseRepository.findAll(spec);

        if (expenses.isEmpty()) {
            return Collections.emptyList();
        }

        String finalGranularity = granularity == null ? "monthly" : granularity.toLowerCase();
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("yyyy-MM");
        WeekFields weekFields = WeekFields.ISO;

        Map<String, BigDecimal> trendMap = expenses.stream()
                .collect(Collectors.groupingBy(
                        expense -> {
                            LocalDate date = expense.getExpenseDate();
                            return switch (finalGranularity) {
                                case "daily" -> date.toString();
                                case "weekly" -> {
                                    int week = date.get(weekFields.weekOfWeekBasedYear());
                                    int year = date.get(weekFields.weekBasedYear());
                                    yield String.format("%d-W%02d", year, week);
                                }
                                default -> date.format(monthFormatter);
                            };
                        },
                        Collectors.reducing(BigDecimal.ZERO, Expense::getAmount, BigDecimal::add)
                ));

        return trendMap.entrySet().stream()
                .map(entry -> SpendingTrendResponse.builder()
                        .periodLabel(entry.getKey())
                        .totalAmount(entry.getValue().setScale(2, RoundingMode.HALF_UP))
                        .build())
                .sorted(Comparator.comparing(SpendingTrendResponse::getPeriodLabel))
                .collect(Collectors.toList());
    }

    private Specification<Expense> dateRangeSpec(LocalDate dateFrom, LocalDate dateTo) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (dateFrom != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("expenseDate"), dateFrom));
            }
            if (dateTo != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("expenseDate"), dateTo));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
