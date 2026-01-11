// Sale types
export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  customerName: string | null;
  customerEmail: string | null;
  notes: string | null;
  itemCount: number;
  createdAt: string;
}

export interface CreateSaleItemInput {
  productId: string;
  quantity: number;
}

export interface CreateSaleInput {
  items: CreateSaleItemInput[];
  customerName?: string;
  customerEmail?: string;
  notes?: string;
}
