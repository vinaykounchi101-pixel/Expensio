package com.expensio.backend.config;

import org.springframework.context.annotation.Configuration;

/**
 * V2 — Defines default and maximum pagination settings.
 * Default page size: 20. Maximum page size: 100.
 */
@Configuration
public class PaginationConfig {

    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;
    public static final int DEFAULT_PAGE_NUMBER = 0;
}
