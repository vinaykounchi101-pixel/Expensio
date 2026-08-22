package com.expensio.backend.service;

import com.expensio.backend.config.PaginationConfig;
import com.expensio.backend.dto.request.CreateExpenseRequest;
import com.expensio.backend.dto.request.ExpenseSearchRequest;
import com.expensio.backend.dto.request.UpdateExpenseRequest;
import com.expensio.backend.dto.response.ExpenseResponse;
import com.expensio.backend.dto.response.ExpenseSummaryResponse;
import com.expensio.backend.dto.response.PagedResponse;
import com.expensio.backend.entity.Expense;
import com.expensio.backend.enums.ExpenseCategory;
import com.expensio.backend.enums.SortDirection;
import com.expensio.backend.exception.ResourceNotFoundException;
import com.expensio.backend.mapper.ExpenseMapper;
import com.expensio.backend.repository.ExpenseRepository;
import com.expensio.backend.specification.ExpenseSpecification;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper expenseMapper;

    @Override
    public ExpenseResponse create(CreateExpenseRequest request) {
        Expense expense = expenseMapper.toEntity(request);
        Expense savedExpense = expenseRepository.save(expense);
        return expenseMapper.toResponse(savedExpense);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ExpenseResponse> search(ExpenseSearchRequest request) {
        // Handle sorting property mapping
        String sortProperty;
        if (request.getSortBy() == null) {
            sortProperty = "expenseDate";
        } else {
            switch (request.getSortBy()) {
                case DATE -> sortProperty = "expenseDate";
                case AMOUNT -> sortProperty = "amount";
                case TITLE -> sortProperty = "title";
                default -> sortProperty = "expenseDate";
            }
        }

        // Handle sorting direction
        Sort.Direction direction = (request.getSortDir() == SortDirection.ASC) 
                ? Sort.Direction.ASC 
                : Sort.Direction.DESC;

        Sort sort = Sort.by(direction, sortProperty);

        // Handle pagination defaults and caps
        int page = (request.getPage() == null) ? PaginationConfig.DEFAULT_PAGE_NUMBER : request.getPage();
        int size = (request.getSize() == null) ? PaginationConfig.DEFAULT_PAGE_SIZE : request.getSize();
        if (size > PaginationConfig.MAX_PAGE_SIZE) {
            size = PaginationConfig.MAX_PAGE_SIZE;
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<Expense> spec = ExpenseSpecification.fromRequest(request);
        Page<Expense> expensePage = expenseRepository.findAll(spec, pageable);

        List<ExpenseResponse> content = expensePage.getContent().stream()
                .map(expenseMapper::toResponse)
                .collect(Collectors.toList());

        return PagedResponse.<ExpenseResponse>builder()
                .content(content)
                .page(expensePage.getNumber())
                .size(expensePage.getSize())
                .totalElements(expensePage.getTotalElements())
                .totalPages(expensePage.getTotalPages())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ExpenseResponse getById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", id));
        return expenseMapper.toResponse(expense);
    }

    @Override
    public ExpenseResponse update(Long id, UpdateExpenseRequest request) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", id));
        expenseMapper.updateEntity(expense, request);
        Expense updatedExpense = expenseRepository.save(expense);
        return expenseMapper.toResponse(updatedExpense);
    }

    @Override
    public void delete(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Expense", id);
        }
        expenseRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public ExpenseSummaryResponse getSummary(ExpenseCategory category, LocalDate date) {
        Specification<Expense> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (category != null) {
                predicates.add(cb.equal(root.get("category"), category));
            }
            if (date != null) {
                predicates.add(cb.equal(root.get("expenseDate"), date));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        List<Expense> expenses = expenseRepository.findAll(spec);
        BigDecimal totalAmount = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        long totalCount = expenses.size();

        return ExpenseSummaryResponse.builder()
                .totalAmount(totalAmount)
                .totalCount(totalCount)
                .build();
    }
}
