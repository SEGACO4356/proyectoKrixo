import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { ISaleRepository } from '../../../domain/repositories/ISaleRepository';
import { IMovementRepository } from '../../../domain/repositories/IMovementRepository';

export function createDashboardRoutes(
  productRepository: IProductRepository,
  saleRepository: ISaleRepository,
  movementRepository: IMovementRepository
): Router {
  const router = Router();
  const controller = new DashboardController(productRepository, saleRepository, movementRepository);

  router.get('/stats', (req, res) => controller.getStats(req, res));

  return router;
}
