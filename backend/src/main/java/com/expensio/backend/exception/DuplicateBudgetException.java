package com.expensio.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * V3 — Thrown when attempting to create a second active budget
 * for the same period + category combination (FR-3.7).
 * Maps to HTTP 409 Conflict.
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateBudgetException extends RuntimeException {

    public DuplicateBudgetException(String message) {
        super(message);
    }
}
