import { IProductRepository } from '../../domain/repositories/IProductRepository';

export class DeleteProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    await this.productRepository.delete(id);
  }
}
