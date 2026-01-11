import { Movement, MovementType } from '../../domain/entities/Movement';
import { IMovementRepository } from '../../domain/repositories/IMovementRepository';

export class InMemoryMovementRepository implements IMovementRepository {
  private movements: Map<string, Movement> = new Map();

  async findAll(): Promise<Movement[]> {
    return Array.from(this.movements.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async findById(id: string): Promise<Movement | null> {
    return this.movements.get(id) || null;
  }

  async findByProductId(productId: string): Promise<Movement[]> {
    return Array.from(this.movements.values())
      .filter(movement => movement.productId === productId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByType(type: MovementType): Promise<Movement[]> {
    return Array.from(this.movements.values())
      .filter(movement => movement.type === type)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Movement[]> {
    return Array.from(this.movements.values())
      .filter(movement => {
        const movementDate = movement.createdAt;
        return movementDate >= startDate && movementDate <= endDate;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async save(movement: Movement): Promise<Movement> {
    this.movements.set(movement.id, movement);
    return movement;
  }
}
