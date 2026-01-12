import { Movement, MovementType } from '../../domain/entities/Movement';
import { IMovementRepository } from '../../domain/repositories/IMovementRepository';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { CreateMovementDTO, MovementResponseDTO } from '../dtos/MovementDTO';

export class RegisterEntryUseCase {
  constructor(
    private readonly movementRepository: IMovementRepository,
    private readonly productRepository: IProductRepository
  ) {}

  async execute(dto: CreateMovementDTO): Promise<MovementResponseDTO> {
    const product = await this.productRepository.findById(dto.productId);
    if (!product) {
      throw new Error(`Producto con ID ${dto.productId} no encontrado`);
    }

    // Create movement
    const movement = new Movement({
      productId: dto.productId,
      type: MovementType.ENTRY,
      quantity: dto.quantity,
      reason: dto.reason,
      reference: dto.reference,
    });

    // Update product stock
    product.addStock(dto.quantity);
    await this.productRepository.update(product);

    // Save movement
    const savedMovement = await this.movementRepository.save(movement);

    return this.toResponseDTO(savedMovement);
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
