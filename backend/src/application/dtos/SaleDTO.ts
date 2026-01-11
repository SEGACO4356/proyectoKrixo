export interface CreateSaleItemDTO {
  productId: string;
  quantity: number;
}

export interface CreateSaleDTO {
  items: CreateSaleItemDTO[];
  customerName?: string;
  customerEmail?: string;
  notes?: string;
}

export interface SaleItemResponseDTO {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface SaleResponseDTO {
  id: string;
  items: SaleItemResponseDTO[];
  total: number;
  customerName: string | null;
  customerEmail: string | null;
  notes: string | null;
  itemCount: number;
  createdAt: string;
}
