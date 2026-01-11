import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { ProductResponseDTO } from '../dtos/ProductDTO';
import { Product } from '../../domain/entities/Product';

export class GetProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(): Promise<ProductResponseDTO[]> {
    const products = await this.productRepository.findAll();
    return products.map(this.toResponseDTO);
  }

  async executeById(id: string): Promise<ProductResponseDTO | null> {
    const product = await this.productRepository.findById(id);
    if (!product) return null;
    return this.toResponseDTO(product);
  }

  async executeByCategory(category: string): Promise<ProductResponseDTO[]> {
    const products = await this.productRepository.findByCategory(category);
    return products.map(this.toResponseDTO);
  }

  async executeLowStock(): Promise<ProductResponseDTO[]> {
    const products = await this.productRepository.findLowStock();
    return products.map(this.toResponseDTO);
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
