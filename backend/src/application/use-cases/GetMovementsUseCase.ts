import { Movement } from '../../domain/entities/Movement';
import { IMovementRepository } from '../../domain/repositories/IMovementRepository';
import { MovementResponseDTO } from '../dtos/MovementDTO';

export class GetMovementsUseCase {
  constructor(private readonly movementRepository: IMovementRepository) {}

  async execute(): Promise<MovementResponseDTO[]> {
    const movements = await this.movementRepository.findAll();
    return movements.map(this.toResponseDTO);
  }

  async executeByProductId(productId: string): Promise<MovementResponseDTO[]> {
    const movements = await this.movementRepository.findByProductId(productId);
    return movements.map(this.toResponseDTO);
  }

  async executeByDateRange(startDate: Date, endDate: Date): Promise<MovementResponseDTO[]> {
    const movements = await this.movementRepository.findByDateRange(startDate, endDate);
    return movements.map(this.toResponseDTO);
  }

  private toResponseDTO(movement: Movement): MovementResponseDTO {
    return {
      id: movement.id,
      productId: movement.productId,
      type: movement.type,
      quantity: movement.quantity,
      reason: movement.reason,
      reference: movement.reference,
      createdAt: movement.createdAt.toISOString(),
    };
  }
}
