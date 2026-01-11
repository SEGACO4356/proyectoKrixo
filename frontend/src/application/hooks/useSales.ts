'use client';

import { useState, useEffect, useCallback } from 'react';
import { saleService } from '@/infrastructure/api';
import type { Sale, CreateSaleInput } from '@/domain/entities';

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await saleService.getAll();
      if (response.success && response.data) {
        setSales(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sales');
    } finally {
      setLoading(false);
    }
  }, []);

  const createSale = async (sale: CreateSaleInput) => {
    try {
      setError(null);
      const response = await saleService.create(sale);
      if (response.success && response.data) {
        setSales(prev => [response.data!, ...prev]);
        return response.data;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create sale';
      setError(message);
      throw new Error(message);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  return {
    sales,
    loading,
    error,
    fetchSales,
    createSale,
  };
}
