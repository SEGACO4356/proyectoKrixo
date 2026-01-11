import { Product } from '../../domain/entities/Product';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { UpdateProductDTO, ProductResponseDTO } from '../dtos/ProductDTO';

export class UpdateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string, dto: UpdateProductDTO): Promise<ProductResponseDTO> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    // Check if SKU is being updated and if it already exists
    if (dto.sku && dto.sku !== product.sku) {
      const existingSku = await this.productRepository.existsBySku(dto.sku);
      if (existingSku) {
        throw new Error(`Product with SKU ${dto.sku} already exists`);
      }
    }

    product.updateDetails(dto);

    const updatedProduct = await this.productRepository.update(product);

    return this.toResponseDTO(updatedProduct);
  }

  private toResponseDTO(product: Product): ProductResponseDTO {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      sku: product.sku,
      price: product.price,
      stock: product.stock,
      minStock: product.minStock,
      category: product.category,
      isLowStock: product.isLowStock(),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }
}
