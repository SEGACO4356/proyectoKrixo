import { Movement, MovementType } from '../entities/Movement';

export interface IMovementRepository {
  findAll(): Promise<Movement[]>;
  findById(id: string): Promise<Movement | null>;
  findByProductId(productId: string): Promise<Movement[]>;
  findByType(type: MovementType): Promise<Movement[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Movement[]>;
  save(movement: Movement): Promise<Movement>;
}
