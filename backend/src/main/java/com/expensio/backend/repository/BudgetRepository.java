package com.expensio.backend.repository;

import com.expensio.backend.entity.Budget;
import com.expensio.backend.enums.ExpenseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * V3 — Budget repository.
 */
@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByPeriodMonth(LocalDate periodMonth);

    Optional<Budget> findByPeriodMonthAndCategory(LocalDate periodMonth, ExpenseCategory category);

    boolean existsByPeriodMonthAndCategory(LocalDate periodMonth, ExpenseCategory category);
}
