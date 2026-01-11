import { v4 as uuidv4 } from 'uuid';

export enum MovementType {
  ENTRY = 'ENTRY',
  EXIT = 'EXIT',
  ADJUSTMENT = 'ADJUSTMENT',
}

export interface MovementProps {
  id?: string;
  productId: string;
  type: MovementType;
  quantity: number;
  reason: string;
  reference?: string;
  createdAt?: Date;
}

export class Movement {
  private readonly _id: string;
  private readonly _productId: string;
  private readonly _type: MovementType;
  private readonly _quantity: number;
  private readonly _reason: string;
  private readonly _reference: string | null;
  private readonly _createdAt: Date;

  constructor(props: MovementProps) {
    this._id = props.id ?? uuidv4();
    this._productId = props.productId;
    this._type = props.type;
    this._quantity = props.quantity;
    this._reason = props.reason;
    this._reference = props.reference ?? null;
    this._createdAt = props.createdAt ?? new Date();

    this.validate();
  }

  private validate(): void {
    if (!this._productId) {
      throw new Error('Product ID is required');
    }
    if (this._quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    if (!this._reason || this._reason.trim().length === 0) {
      throw new Error('Reason is required');
    }
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get productId(): string {
    return this._productId;
  }

  get type(): MovementType {
    return this._type;
  }

  get quantity(): number {
    return this._quantity;
  }

  get reason(): string {
    return this._reason;
  }

  get reference(): string | null {
    return this._reference;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  isEntry(): boolean {
    return this._type === MovementType.ENTRY;
  }

  isExit(): boolean {
    return this._type === MovementType.EXIT;
  }

  toJSON(): MovementProps {
    return {
      id: this._id,
      productId: this._productId,
      type: this._type,
      quantity: this._quantity,
      reason: this._reason,
      reference: this._reference ?? undefined,
      createdAt: this._createdAt,
    };
  }
}
