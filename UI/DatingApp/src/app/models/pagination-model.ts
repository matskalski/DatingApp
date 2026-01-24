export interface Pagination {
  PageNumber: number,
  pageSize: number,
  totalCount: number,
  totalPages: number
}

export interface PaginatedResult<T> {
  items: T[];
  matadata: Pagination;
}
