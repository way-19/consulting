import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';

interface FilterConfig {
  searchFields?: string[];
  defaultFilters?: Record<string, any>;
  sortOptions?: Array<{
    key: string;
    label: string;
    direction?: 'asc' | 'desc';
  }>;
}

interface FilterState {
  searchTerm: string;
  filters: Record<string, any>;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

interface FilterControls {
  setSearchTerm: (term: string) => void;
  setFilter: (key: string, value: any) => void;
  clearFilters: () => void;
  setSort: (key: string, direction?: 'asc' | 'desc') => void;
  applyFilters: <T>(data: T[]) => T[];
}

export const useAdvancedFilter = <T extends Record<string, any>>(
  data: T[],
  config: FilterConfig = {}
): [T[], FilterState, FilterControls] => {
  const {
    searchFields = ['name', 'title'],
    defaultFilters = {},
    sortOptions = []
  } = config;

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>(defaultFilters);
  const [sortBy, setSortBy] = useState(sortOptions[0]?.key || 'created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    sortOptions[0]?.direction || 'desc'
  );

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(item => {
        return searchFields.some(field => {
          const value = getNestedValue(item, field);
          return value?.toString().toLowerCase().includes(searchLower);
        });
      });
    }

    // Apply custom filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== 'all' && value !== '') {
        result = result.filter(item => {
          const itemValue = getNestedValue(item, key);
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }
          return itemValue === value;
        });
      }
    });

    // Apply sorting
    if (sortBy) {
      result.sort((a, b) => {
        const aVal = getNestedValue(a, sortBy);
        const bVal = getNestedValue(b, sortBy);
        
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        
        let comparison = 0;
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          comparison = aVal.localeCompare(bVal);
        } else if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal;
        } else if (aVal instanceof Date && bVal instanceof Date) {
          comparison = aVal.getTime() - bVal.getTime();
        } else {
          comparison = String(aVal).localeCompare(String(bVal));
        }
        
        return sortDirection === 'desc' ? -comparison : comparison;
      });
    }

    return result;
  }, [data, searchTerm, filters, sortBy, sortDirection, searchFields]);

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const setFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters(defaultFilters);
  };

  const setSort = (key: string, direction?: 'asc' | 'desc') => {
    setSortBy(key);
    setSortDirection(direction || (sortBy === key && sortDirection === 'asc' ? 'desc' : 'asc'));
  };

  const applyFilters = <U extends Record<string, any>>(inputData: U[]) => {
    // This function can be used to apply the same filters to different datasets
    // Implementation would be similar to the above logic
    return inputData;
  };

  const state: FilterState = {
    searchTerm,
    filters,
    sortBy,
    sortDirection
  };

  const controls: FilterControls = {
    setSearchTerm,
    setFilter,
    clearFilters,
    setSort,
    applyFilters
  };

  return [filteredAndSortedData, state, controls];
};