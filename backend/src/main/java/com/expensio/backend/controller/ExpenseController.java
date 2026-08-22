package com.expensio.backend.controller;

import com.expensio.backend.dto.request.CreateExpenseRequest;
import com.expensio.backend.dto.request.ExpenseSearchRequest;
import com.expensio.backend.dto.request.UpdateExpenseRequest;
import com.expensio.backend.dto.response.ExpenseResponse;
import com.expensio.backend.dto.response.ExpenseSummaryResponse;
import com.expensio.backend.dto.response.PagedResponse;
import com.expensio.backend.enums.ExpenseCategory;
import com.expensio.backend.enums.SortDirection;
import com.expensio.backend.enums.SortField;
import com.expensio.backend.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseResponse> create(@Valid @RequestBody CreateExpenseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(expenseService.create(request));
    }

    @GetMapping
    public ResponseEntity<PagedResponse<ExpenseResponse>> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) ExpenseCategory category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) BigDecimal amountMin,
            @RequestParam(required = false) BigDecimal amountMax,
            @RequestParam(required = false) SortField sortBy,
            @RequestParam(required = false) SortDirection sortDir,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {

        ExpenseSearchRequest searchRequest = new ExpenseSearchRequest();
        searchRequest.setQ(q);
        searchRequest.setCategory(category);
        searchRequest.setDate(date);
        searchRequest.setDateFrom(dateFrom);
        searchRequest.setDateTo(dateTo);
        searchRequest.setAmountMin(amountMin);
        searchRequest.setAmountMax(amountMax);
        searchRequest.setSortBy(sortBy);
        searchRequest.setSortDir(sortDir);
        searchRequest.setPage(page);
        searchRequest.setSize(size);

        return ResponseEntity.ok(expenseService.search(searchRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(expenseService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> update(@PathVariable Long id,
                                                   @Valid @RequestBody UpdateExpenseRequest request) {
        return ResponseEntity.ok(expenseService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        expenseService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<ExpenseSummaryResponse> getSummary(
            @RequestParam(required = false) ExpenseCategory category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(expenseService.getSummary(category, date));
    }
}
