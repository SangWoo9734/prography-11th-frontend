"use client";

import { cn } from "@/app/utils/cn";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  const pageWindowStart = Math.floor((page - 1) / 5) * 5 + 1;
  const pageNumbers = Array.from(
    { length: Math.min(5, totalPages - pageWindowStart + 1) },
    (_, i) => pageWindowStart + i,
  );

  return (
    <div className="flex items-center justify-center gap-1 text-sm py-2">
      <button
        className="px-2 py-1 hover:bg-gray-100 rounded disabled:opacity-30"
        onClick={() => onPageChange(1)}
        disabled={page === 1}
      >
        |&lt;
      </button>
      <button
        className="px-2 py-1 hover:bg-gray-100 rounded disabled:opacity-30"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        &lt;
      </button>
      {pageNumbers.map((n) => (
        <button
          key={n}
          className={cn("px-3 py-1 rounded", n === page ? "bg-blue-600 text-white" : "hover:bg-gray-100")}
          onClick={() => onPageChange(n)}
        >
          {n}
        </button>
      ))}
      <button
        className="px-2 py-1 hover:bg-gray-100 rounded disabled:opacity-30"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        &gt;
      </button>
      <button
        className="px-2 py-1 hover:bg-gray-100 rounded disabled:opacity-30"
        onClick={() => onPageChange(totalPages)}
        disabled={page === totalPages}
      >
        &gt;|
      </button>
    </div>
  );
}
