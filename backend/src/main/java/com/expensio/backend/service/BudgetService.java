package com.expensio.backend.service;

import com.expensio.backend.dto.request.CreateBudgetRequest;
import com.expensio.backend.dto.request.UpdateBudgetRequest;
import com.expensio.backend.dto.response.BudgetResponse;

import java.time.LocalDate;
import java.util.List;

/**
 * V3 — Budget service interface.
 */
public interface BudgetService {

    BudgetResponse create(CreateBudgetRequest request);

    List<BudgetResponse> getAll(LocalDate periodMonth);

    BudgetResponse getById(Long id);

    BudgetResponse update(Long id, UpdateBudgetRequest request);

    void delete(Long id);
}
