package com.expensio.backend.entity;

import com.expensio.backend.enums.ExpenseCategory;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

/**
 * V3 — JPA entity for the budgets table.
 * category == null means an overall (uncategorised) budget.
 * UNIQUE constraint on (period_month, category) enforced at DB level;
 * null-category duplicate check must also be enforced in BudgetService.
 */
@Entity
@Table(
        name = "budgets",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_budget_period_category",
                columnNames = {"period_month", "category"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * First day of the budgeted month, e.g. 2026-08-01.
     */
    @Column(name = "period_month", nullable = false)
    private LocalDate periodMonth;

    /**
     * Null means the budget applies to all categories (overall budget).
     */
    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private ExpenseCategory category;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
