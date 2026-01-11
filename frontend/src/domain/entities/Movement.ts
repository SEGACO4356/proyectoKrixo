// Movement types
export type MovementType = 'ENTRY' | 'EXIT' | 'ADJUSTMENT';

export interface Movement {
  id: string;
  productId: string;
  type: MovementType;
  quantity: number;
  reason: string;
  reference: string | null;
  createdAt: string;
}

export interface CreateMovementInput {
  productId: string;
  quantity: number;
  reason: string;
  reference?: string;
}
