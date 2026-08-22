package com.expensio.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * V2 — Generic paginated response wrapper.
 *
 * @param <T> The type of items in the content list.
 */
@Data
@Builder
public class PagedResponse<T> {

    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}
