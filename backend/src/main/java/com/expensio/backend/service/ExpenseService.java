package com.expensio.backend.service;

import com.expensio.backend.dto.request.CreateExpenseRequest;
import com.expensio.backend.dto.request.ExpenseSearchRequest;
import com.expensio.backend.dto.request.UpdateExpenseRequest;
import com.expensio.backend.dto.response.ExpenseResponse;
import com.expensio.backend.dto.response.ExpenseSummaryResponse;
import com.expensio.backend.dto.response.PagedResponse;
import com.expensio.backend.enums.ExpenseCategory;

import java.time.LocalDate;

public interface ExpenseService {

    ExpenseResponse create(CreateExpenseRequest request);

    PagedResponse<ExpenseResponse> search(ExpenseSearchRequest request);

    ExpenseResponse getById(Long id);

    ExpenseResponse update(Long id, UpdateExpenseRequest request);

    void delete(Long id);

    ExpenseSummaryResponse getSummary(ExpenseCategory category, LocalDate date);
}
