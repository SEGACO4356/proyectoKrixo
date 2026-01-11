import { Product } from '../../domain/entities/Product';
import { IProductRepository } from '../../domain/repositories/IProductRepository';

export class InMemoryProductRepository implements IProductRepository {
  private products: Map<string, Product> = new Map();

  async findAll(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) || null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    for (const product of this.products.values()) {
      if (product.sku === sku) {
        return product;
      }
    }
    return null;
  }

  async findByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  async findLowStock(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.isLowStock());
  }

  async save(product: Product): Promise<Product> {
    this.products.set(product.id, product);
    return product;
  }

  async update(product: Product): Promise<Product> {
    if (!this.products.has(product.id)) {
      throw new Error(`Product with id ${product.id} not found`);
    }
    this.products.set(product.id, product);
    return product;
  }

  async delete(id: string): Promise<void> {
    this.products.delete(id);
  }

  async existsBySku(sku: string): Promise<boolean> {
    for (const product of this.products.values()) {
      if (product.sku === sku) {
        return true;
      }
    }
    return false;
  }
}
