import { Request, Response } from 'express';
import { RegisterSaleUseCase, GetSalesUseCase } from '../../../application/use-cases';
import { ISaleRepository } from '../../../domain/repositories/ISaleRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { IMovementRepository } from '../../../domain/repositories/IMovementRepository';

export class SaleController {
  private registerSaleUseCase: RegisterSaleUseCase;
  private getSalesUseCase: GetSalesUseCase;

  constructor(
    saleRepository: ISaleRepository,
    productRepository: IProductRepository,
    movementRepository: IMovementRepository
  ) {
    this.registerSaleUseCase = new RegisterSaleUseCase(
      saleRepository,
      productRepository,
      movementRepository
    );
    this.getSalesUseCase = new GetSalesUseCase(saleRepository);
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const sales = await this.getSalesUseCase.execute();
      res.json({ success: true, data: sales });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const sale = await this.getSalesUseCase.executeById(id);
      if (!sale) {
        res.status(404).json({ success: false, error: 'Sale not found' });
        return;
      }
      res.json({ success: true, data: sale });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const sale = await this.registerSaleUseCase.execute(req.body);
      res.status(201).json({ success: true, data: sale });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      
      // Check if it's a stock-related error
      if (message.includes('Insufficient stock') || message.includes('not found')) {
        res.status(400).json({ 
          success: false, 
          error: message,
          code: message.includes('Insufficient stock') ? 'INSUFFICIENT_STOCK' : 'PRODUCT_NOT_FOUND'
        });
        return;
      }
      
      res.status(400).json({ success: false, error: message });
    }
  }
}
