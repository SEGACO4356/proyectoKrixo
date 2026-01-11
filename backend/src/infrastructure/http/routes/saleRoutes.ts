import { Router } from 'express';
import { SaleController } from '../controllers/SaleController';
import { ISaleRepository } from '../../../domain/repositories/ISaleRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { IMovementRepository } from '../../../domain/repositories/IMovementRepository';

export function createSaleRoutes(
  saleRepository: ISaleRepository,
  productRepository: IProductRepository,
  movementRepository: IMovementRepository
): Router {
  const router = Router();
  const controller = new SaleController(saleRepository, productRepository, movementRepository);

  router.get('/', (req, res) => controller.getAll(req, res));
  router.get('/:id', (req, res) => controller.getById(req, res));
  router.post('/', (req, res) => controller.create(req, res));

  return router;
}
