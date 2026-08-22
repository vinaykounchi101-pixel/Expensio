package com.expensio.backend.exception;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

/**
 * Standard error response shape for all failure modes.
 * No raw stack traces are ever exposed to clients.
 */
@Data
@Builder
public class ErrorResponse {

    private OffsetDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
}
