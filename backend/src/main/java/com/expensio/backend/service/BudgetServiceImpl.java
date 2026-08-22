package com.expensio.backend.service;

import com.expensio.backend.dto.request.CreateBudgetRequest;
import com.expensio.backend.dto.request.UpdateBudgetRequest;
import com.expensio.backend.dto.response.BudgetResponse;
import com.expensio.backend.entity.Budget;
import com.expensio.backend.exception.DuplicateBudgetException;
import com.expensio.backend.exception.ResourceNotFoundException;
import com.expensio.backend.mapper.BudgetMapper;
import com.expensio.backend.repository.BudgetRepository;
import com.expensio.backend.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final BudgetMapper budgetMapper;

    @Override
    public BudgetResponse create(CreateBudgetRequest request) {
        // Normalize periodMonth to first day of the month
        LocalDate periodMonth = request.getPeriodMonth().withDayOfMonth(1);

        // Check for duplicate budget (FR-3.7)
        if (budgetRepository.existsByPeriodMonthAndCategory(periodMonth, request.getCategory())) {
            String catMsg = (request.getCategory() == null) ? "overall" : request.getCategory().name();
            throw new DuplicateBudgetException("A budget already exists for period " + periodMonth + " and category: " + catMsg);
        }

        Budget budget = budgetMapper.toEntity(request);
        budget.setPeriodMonth(periodMonth);
        Budget savedBudget = budgetRepository.save(budget);

        BigDecimal spent = calculateSpent(savedBudget);
        return budgetMapper.toResponse(savedBudget, spent);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BudgetResponse> getAll(LocalDate periodMonth) {
        List<Budget> budgets;
        if (periodMonth != null) {
            LocalDate normalized = periodMonth.withDayOfMonth(1);
            budgets = budgetRepository.findByPeriodMonth(normalized);
        } else {
            budgets = budgetRepository.findAll();
        }

        return budgets.stream()
                .map(b -> budgetMapper.toResponse(b, calculateSpent(b)))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BudgetResponse getById(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget", id));
        return budgetMapper.toResponse(budget, calculateSpent(budget));
    }

    @Override
    public BudgetResponse update(Long id, UpdateBudgetRequest request) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget", id));
        budget.setAmount(request.getAmount());
        Budget updatedBudget = budgetRepository.save(budget);
        return budgetMapper.toResponse(updatedBudget, calculateSpent(updatedBudget));
    }

    @Override
    public void delete(Long id) {
        if (!budgetRepository.existsById(id)) {
            throw new ResourceNotFoundException("Budget", id);
        }
        budgetRepository.deleteById(id);
    }

    private BigDecimal calculateSpent(Budget budget) {
        LocalDate start = budget.getPeriodMonth();
        LocalDate end = start.plusMonths(1).minusDays(1);
        return expenseRepository.sumByDateRangeAndCategory(start, end, budget.getCategory());
    }
}
