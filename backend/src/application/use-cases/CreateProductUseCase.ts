import { Product } from '../../domain/entities/Product';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { CreateProductDTO, ProductResponseDTO } from '../dtos/ProductDTO';

export class CreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(dto: CreateProductDTO): Promise<ProductResponseDTO> {
    // Check if SKU already exists
    const existingSku = await this.productRepository.existsBySku(dto.sku);
    if (existingSku) {
      throw new Error(`Product with SKU ${dto.sku} already exists`);
    }

    const product = new Product({
      name: dto.name,
      description: dto.description,
      sku: dto.sku,
      price: dto.price,
      stock: dto.stock,
      minStock: dto.minStock,
      category: dto.category,
    });

    const savedProduct = await this.productRepository.save(product);

    return this.toResponseDTO(savedProduct);
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
