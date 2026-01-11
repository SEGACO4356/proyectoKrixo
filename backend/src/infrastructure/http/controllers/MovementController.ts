import { Request, Response } from 'express';
import {
  RegisterEntryUseCase,
  RegisterExitUseCase,
  GetMovementsUseCase,
} from '../../../application/use-cases';
import { IMovementRepository } from '../../../domain/repositories/IMovementRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { MovementType } from '../../../domain/entities/Movement';

export class MovementController {
  private registerEntryUseCase: RegisterEntryUseCase;
  private registerExitUseCase: RegisterExitUseCase;
  private getMovementsUseCase: GetMovementsUseCase;

  constructor(
    movementRepository: IMovementRepository,
    productRepository: IProductRepository
  ) {
    this.registerEntryUseCase = new RegisterEntryUseCase(movementRepository, productRepository);
    this.registerExitUseCase = new RegisterExitUseCase(movementRepository, productRepository);
    this.getMovementsUseCase = new GetMovementsUseCase(movementRepository);
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const movements = await this.getMovementsUseCase.execute();
      res.json({ success: true, data: movements });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: message });
    }
  }

  async getByProductId(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.params.productId as string;
      const movements = await this.getMovementsUseCase.executeByProductId(productId);
      res.json({ success: true, data: movements });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: message });
    }
  }

  async registerEntry(req: Request, res: Response): Promise<void> {
    try {
      const movement = await this.registerEntryUseCase.execute({
        ...req.body,
        type: MovementType.ENTRY,
      });
      res.status(201).json({ success: true, data: movement });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ success: false, error: message });
    }
  }

  async registerExit(req: Request, res: Response): Promise<void> {
    try {
      const movement = await this.registerExitUseCase.execute({
        ...req.body,
        type: MovementType.EXIT,
      });
      res.status(201).json({ success: true, data: movement });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ success: false, error: message });
    }
  }
}
