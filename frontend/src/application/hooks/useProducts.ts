'use client';

import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/infrastructure/api';
import type { Product, CreateProductInput, UpdateProductInput } from '@/domain/entities';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getAll();
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = async (product: CreateProductInput) => {
    try {
      setError(null);
      const response = await productService.create(product);
      if (response.success && response.data) {
        setProducts(prev => [...prev, response.data!]);
        return response.data;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create product';
      setError(message);
      throw new Error(message);
    }
  };

  const updateProduct = async (id: string, product: UpdateProductInput) => {
    try {
      setError(null);
      const response = await productService.update(id, product);
      if (response.success && response.data) {
        setProducts(prev => prev.map(p => p.id === id ? response.data! : p));
        return response.data;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update product';
      setError(message);
      throw new Error(message);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setError(null);
      await productService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete product';
      setError(message);
      throw new Error(message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
