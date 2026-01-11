import { v4 as uuidv4 } from 'uuid';

export interface ProductProps {
  id?: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  minStock: number;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product {
  private readonly _id: string;
  private _name: string;
  private _description: string;
  private _sku: string;
  private _price: number;
  private _stock: number;
  private _minStock: number;
  private _category: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ProductProps) {
    this._id = props.id ?? uuidv4();
    this._name = props.name;
    this._description = props.description;
    this._sku = props.sku;
    this._price = props.price;
    this._stock = props.stock;
    this._minStock = props.minStock;
    this._category = props.category;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();

    this.validate();
  }

  private validate(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('Product name is required');
    }
    if (!this._sku || this._sku.trim().length === 0) {
      throw new Error('Product SKU is required');
    }
    if (this._price < 0) {
      throw new Error('Product price cannot be negative');
    }
    if (this._stock < 0) {
      throw new Error('Product stock cannot be negative');
    }
    if (this._minStock < 0) {
      throw new Error('Minimum stock cannot be negative');
    }
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get sku(): string {
    return this._sku;
  }

  get price(): number {
    return this._price;
  }

  get stock(): number {
    return this._stock;
  }

  get minStock(): number {
    return this._minStock;
  }

  get category(): string {
    return this._category;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Domain Methods
  addStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    this._stock += quantity;
    this._updatedAt = new Date();
  }

  removeStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    if (quantity > this._stock) {
      throw new Error('Insufficient stock');
    }
    this._stock -= quantity;
    this._updatedAt = new Date();
  }

  isLowStock(): boolean {
    return this._stock <= this._minStock;
  }

  updateDetails(props: Partial<Omit<ProductProps, 'id' | 'createdAt'>>): void {
    if (props.name !== undefined) this._name = props.name;
    if (props.description !== undefined) this._description = props.description;
    if (props.sku !== undefined) this._sku = props.sku;
    if (props.price !== undefined) this._price = props.price;
    if (props.stock !== undefined) this._stock = props.stock;
    if (props.minStock !== undefined) this._minStock = props.minStock;
    if (props.category !== undefined) this._category = props.category;
    this._updatedAt = new Date();
    this.validate();
  }

  toJSON(): ProductProps {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      sku: this._sku,
      price: this._price,
      stock: this._stock,
      minStock: this._minStock,
      category: this._category,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
