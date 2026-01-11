import { apiClient } from './apiClient';
import type { Product, CreateProductInput, UpdateProductInput } from '@/domain/entities';
import type { ApiResponse } from '@/domain/types';

export const productService = {
  getAll: () => 
    apiClient.get<ApiResponse<Product[]>>('/products'),

  getById: (id: string) => 
    apiClient.get<ApiResponse<Product>>(`/products/${id}`),

  getByCategory: (category: string) => 
    apiClient.get<ApiResponse<Product[]>>(`/products/category/${category}`),

  getLowStock: () => 
    apiClient.get<ApiResponse<Product[]>>('/products/low-stock'),

  create: (product: CreateProductInput) => 
    apiClient.post<ApiResponse<Product>>('/products', product),

  update: (id: string, product: UpdateProductInput) => 
    apiClient.put<ApiResponse<Product>>(`/products/${id}`, product),

  delete: (id: string) => 
    apiClient.delete<ApiResponse<void>>(`/products/${id}`),
};
