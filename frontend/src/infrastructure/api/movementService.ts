import { apiClient } from './apiClient';
import type { Movement, CreateMovementInput } from '@/domain/entities';
import type { ApiResponse } from '@/domain/types';

export const movementService = {
  getAll: () => 
    apiClient.get<ApiResponse<Movement[]>>('/movements'),

  getByProductId: (productId: string) => 
    apiClient.get<ApiResponse<Movement[]>>(`/movements/product/${productId}`),

  registerEntry: (movement: CreateMovementInput) => 
    apiClient.post<ApiResponse<Movement>>('/movements/entry', movement),

  registerExit: (movement: CreateMovementInput) => 
    apiClient.post<ApiResponse<Movement>>('/movements/exit', movement),
};
