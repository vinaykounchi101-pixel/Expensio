package com.expensio.backend.specification;

import com.expensio.backend.dto.request.ExpenseSearchRequest;
import com.expensio.backend.entity.Expense;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

/**
 * V2 — Builds JPA Specification predicates from an ExpenseSearchRequest.
 * All predicates are AND-combined. No business logic lives here —
 * only dynamic query construction.
 */
public class ExpenseSpecification {

    private ExpenseSpecification() {
        // Utility class — do not instantiate
    }

    public static Specification<Expense> fromRequest(ExpenseSearchRequest req) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (req.getCategory() != null) {
                predicates.add(cb.equal(root.get("category"), req.getCategory()));
            }

            // V1 exact date (still honoured when dateFrom/dateTo are absent)
            if (req.getDate() != null && req.getDateFrom() == null && req.getDateTo() == null) {
                predicates.add(cb.equal(root.get("expenseDate"), req.getDate()));
            }

            if (req.getDateFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("expenseDate"), req.getDateFrom()));
            }

            if (req.getDateTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("expenseDate"), req.getDateTo()));
            }

            if (req.getAmountMin() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("amount"), req.getAmountMin()));
            }

            if (req.getAmountMax() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("amount"), req.getAmountMax()));
            }

            // Free-text search on title and description (case-insensitive LIKE)
            if (req.getQ() != null && !req.getQ().isBlank()) {
                String pattern = "%" + req.getQ().toLowerCase() + "%";
                Predicate titleMatch = cb.like(cb.lower(root.get("title")), pattern);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), pattern);
                predicates.add(cb.or(titleMatch, descMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
