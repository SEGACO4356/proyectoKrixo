import { Sale, SaleItemProps } from '../../domain/entities/Sale';
import { Movement, MovementType } from '../../domain/entities/Movement';
import { ISaleRepository } from '../../domain/repositories/ISaleRepository';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { IMovementRepository } from '../../domain/repositories/IMovementRepository';
import { CreateSaleDTO, SaleResponseDTO } from '../dtos/SaleDTO';

export class RegisterSaleUseCase {
  constructor(
    private readonly saleRepository: ISaleRepository,
    private readonly productRepository: IProductRepository,
    private readonly movementRepository: IMovementRepository
  ) {}

  async execute(dto: CreateSaleDTO): Promise<SaleResponseDTO> {
    const saleItems: SaleItemProps[] = [];
    let total = 0;

    // Validate products and calculate totals
    for (const item of dto.items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new Error(`Producto con ID ${item.productId} no encontrado`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para "${product.name}". Disponible: ${product.stock}, Solicitado: ${item.quantity}`);
      }

      const subtotal = product.price * item.quantity;
      saleItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal,
      });
      total += subtotal;
    }

    // Create sale
    const sale = new Sale({
      items: saleItems,
      total,
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
      notes: dto.notes,
    });

    // Update stock and create movements for each item
    for (const item of dto.items) {
      const product = await this.productRepository.findById(item.productId);
      if (product) {
        product.removeStock(item.quantity);
        await this.productRepository.update(product);

        // Create exit movement for the sale
        const movement = new Movement({
          productId: item.productId,
          type: MovementType.EXIT,
          quantity: item.quantity,
          reason: 'Sale',
          reference: sale.id,
        });
        await this.movementRepository.save(movement);
      }
    }

    // Save sale
    const savedSale = await this.saleRepository.save(sale);

    return this.toResponseDTO(savedSale);
  }

  private toResponseDTO(sale: Sale): SaleResponseDTO {
    return {
      id: sale.id,
      items: sale.items.map(item => item.toJSON()),
      total: sale.total,
      customerName: sale.customerName,
      customerEmail: sale.customerEmail,
      notes: sale.notes,
      itemCount: sale.itemCount,
      createdAt: sale.createdAt.toISOString(),
    };
  }
}
