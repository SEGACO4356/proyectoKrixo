import { apiClient } from './apiClient';
import type { Sale, CreateSaleInput } from '@/domain/entities';
import type { ApiResponse } from '@/domain/types';

export const saleService = {
  getAll: () => 
    apiClient.get<ApiResponse<Sale[]>>('/sales'),

  getById: (id: string) => 
    apiClient.get<ApiResponse<Sale>>(`/sales/${id}`),

  create: (sale: CreateSaleInput) => 
    apiClient.post<ApiResponse<Sale>>('/sales', sale),
};
