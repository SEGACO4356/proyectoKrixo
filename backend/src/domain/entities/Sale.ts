import { v4 as uuidv4 } from 'uuid';

export interface SaleItemProps {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface SaleProps {
  id?: string;
  items: SaleItemProps[];
  total: number;
  customerName?: string;
  customerEmail?: string;
  notes?: string;
  createdAt?: Date;
}

export class SaleItem {
  private readonly _productId: string;
  private readonly _productName: string;
  private readonly _quantity: number;
  private readonly _unitPrice: number;
  private readonly _subtotal: number;

  constructor(props: SaleItemProps) {
    this._productId = props.productId;
    this._productName = props.productName;
    this._quantity = props.quantity;
    this._unitPrice = props.unitPrice;
    this._subtotal = props.subtotal;

    this.validate();
  }

  private validate(): void {
    if (!this._productId) {
      throw new Error('Product ID is required');
    }
    if (this._quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    if (this._unitPrice < 0) {
      throw new Error('Unit price cannot be negative');
    }
  }

  get productId(): string {
    return this._productId;
  }

  get productName(): string {
    return this._productName;
  }

  get quantity(): number {
    return this._quantity;
  }

  get unitPrice(): number {
    return this._unitPrice;
  }

  get subtotal(): number {
    return this._subtotal;
  }

  toJSON(): SaleItemProps {
    return {
      productId: this._productId,
      productName: this._productName,
      quantity: this._quantity,
      unitPrice: this._unitPrice,
      subtotal: this._subtotal,
    };
  }
}

export class Sale {
  private readonly _id: string;
  private readonly _items: SaleItem[];
  private readonly _total: number;
  private readonly _customerName: string | null;
  private readonly _customerEmail: string | null;
  private readonly _notes: string | null;
  private readonly _createdAt: Date;

  constructor(props: SaleProps) {
    this._id = props.id ?? uuidv4();
    this._items = props.items.map(item => new SaleItem(item));
    this._total = props.total;
    this._customerName = props.customerName ?? null;
    this._customerEmail = props.customerEmail ?? null;
    this._notes = props.notes ?? null;
    this._createdAt = props.createdAt ?? new Date();

    this.validate();
  }

  private validate(): void {
    if (this._items.length === 0) {
      throw new Error('Sale must have at least one item');
    }
    if (this._total < 0) {
      throw new Error('Total cannot be negative');
    }
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get items(): SaleItem[] {
    return [...this._items];
  }

  get total(): number {
    return this._total;
  }

  get customerName(): string | null {
    return this._customerName;
  }

  get customerEmail(): string | null {
    return this._customerEmail;
  }

  get notes(): string | null {
    return this._notes;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get itemCount(): number {
    return this._items.reduce((acc, item) => acc + item.quantity, 0);
  }

  toJSON(): SaleProps {
    return {
      id: this._id,
      items: this._items.map(item => item.toJSON()),
      total: this._total,
      customerName: this._customerName ?? undefined,
      customerEmail: this._customerEmail ?? undefined,
      notes: this._notes ?? undefined,
      createdAt: this._createdAt,
    };
  }
}
