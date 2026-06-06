import { useState, useMemo } from "react";
export const usePagination = <T,>(items: T[], itemsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange,
    itemsPerPage,
    totalItems: items.length
  };
};