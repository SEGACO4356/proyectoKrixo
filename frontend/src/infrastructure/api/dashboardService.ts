import { apiClient } from './apiClient';
import type { DashboardStats } from '@/domain/entities';
import type { ApiResponse } from '@/domain/types';

export const dashboardService = {
  getStats: () => 
    apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats'),
};
