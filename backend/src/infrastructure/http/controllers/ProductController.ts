import { Request, Response } from 'express';
import {
  CreateProductUseCase,
  GetProductsUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
} from '../../../application/use-cases';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';

export class ProductController {
  private createProductUseCase: CreateProductUseCase;
  private getProductsUseCase: GetProductsUseCase;
  private updateProductUseCase: UpdateProductUseCase;
  private deleteProductUseCase: DeleteProductUseCase;

  constructor(productRepository: IProductRepository) {
    this.createProductUseCase = new CreateProductUseCase(productRepository);
    this.getProductsUseCase = new GetProductsUseCase(productRepository);
    this.updateProductUseCase = new UpdateProductUseCase(productRepository);
    this.deleteProductUseCase = new DeleteProductUseCase(productRepository);
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.getProductsUseCase.execute();
      res.json({ success: true, data: products });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const product = await this.getProductsUseCase.executeById(id);
      if (!product) {
        res.status(404).json({ success: false, error: 'Product not found' });
        return;
      }
      res.json({ success: true, data: product });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: message });
    }
  }

  async getByCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = req.params.category as string;
      const products = await this.getProductsUseCase.executeByCategory(category);
      res.json({ success: true, data: products });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: message });
    }
  }

  async getLowStock(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.getProductsUseCase.executeLowStock();
      res.json({ success: true, data: products });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const product = await this.createProductUseCase.execute(req.body);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ success: false, error: message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const product = await this.updateProductUseCase.execute(id, req.body);
      res.json({ success: true, data: product });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ success: false, error: message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await this.deleteProductUseCase.execute(id);
      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ success: false, error: message });
    }
  }
}
