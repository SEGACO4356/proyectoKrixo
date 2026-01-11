import { MovementType } from '../../domain/entities/Movement';

export interface CreateMovementDTO {
  productId: string;
  type: MovementType;
  quantity: number;
  reason: string;
  reference?: string;
}

export interface MovementResponseDTO {
  id: string;
  productId: string;
  type: MovementType;
  quantity: number;
  reason: string;
  reference: string | null;
  createdAt: string;
}
