// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  minStock: number;
  category: string;
  isLowStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  minStock: number;
  category: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  sku?: string;
  price?: number;
  stock?: number;
  minStock?: number;
  category?: string;
}
