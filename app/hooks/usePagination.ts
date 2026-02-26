import { useState } from "react";

export function usePagination<T>(items: T[], itemsPerPage: number) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const paginatedItems = items.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  return { page, setPage, totalPages, paginatedItems };
}
