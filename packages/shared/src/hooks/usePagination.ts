import { useState, useEffect, useMemo } from 'react';

interface PaginationConfig {
  initialPage?: number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
}

interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PaginationControls {
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotalItems: (total: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToFirst: () => void;
  goToLast: () => void;
}

export const usePagination = (config: PaginationConfig = {}): [PaginationState, PaginationControls] => {
  const {
    initialPage = 1,
    initialPageSize = 10,
    pageSizeOptions = [10, 25, 50, 100]
  } = config;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(0);

  // Calculate derived values
  const state = useMemo<PaginationState>(() => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    
    return {
      currentPage,
      pageSize,
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };
  }, [currentPage, pageSize, totalItems]);

  // Reset to page 1 when page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  // Ensure current page is valid when total items change
  useEffect(() => {
    if (state.totalPages > 0 && currentPage > state.totalPages) {
      setCurrentPage(state.totalPages);
    }
  }, [totalItems, state.totalPages, currentPage]);

  const controls: PaginationControls = {
    setPage: setCurrentPage,
    setPageSize,
    setTotalItems,
    nextPage: () => state.hasNextPage && setCurrentPage(prev => prev + 1),
    prevPage: () => state.hasPrevPage && setCurrentPage(prev => prev - 1),
    goToFirst: () => setCurrentPage(1),
    goToLast: () => setCurrentPage(state.totalPages),
  };

  return [state, controls];
};

export default usePagination;