package com.expensio.backend.repository;

import com.expensio.backend.entity.Expense;
import com.expensio.backend.enums.ExpenseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Extends JpaSpecificationExecutor to support V2 dynamic search/filter/sort/page
 * via ExpenseSpecification.
 */
@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long>,
        JpaSpecificationExecutor<Expense> {

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e " +
           "WHERE e.expenseDate >= :start AND e.expenseDate <= :end " +
           "AND (:category IS NULL OR e.category = :category)")
    BigDecimal sumByDateRangeAndCategory(
            @Param("start") LocalDate start,
            @Param("end") LocalDate end,
            @Param("category") ExpenseCategory category);
}

