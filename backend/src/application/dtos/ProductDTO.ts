export interface CreateProductDTO {
  name: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  minStock: number;
  category: string;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  sku?: string;
  price?: number;
  stock?: number;
  minStock?: number;
  category?: string;
}

export interface ProductResponseDTO {
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
