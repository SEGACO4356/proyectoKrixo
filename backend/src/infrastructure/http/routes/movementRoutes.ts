import { Router } from 'express';
import { MovementController } from '../controllers/MovementController';
import { IMovementRepository } from '../../../domain/repositories/IMovementRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';

export function createMovementRoutes(
  movementRepository: IMovementRepository,
  productRepository: IProductRepository
): Router {
  const router = Router();
  const controller = new MovementController(movementRepository, productRepository);

  router.get('/', (req, res) => controller.getAll(req, res));
  router.get('/product/:productId', (req, res) => controller.getByProductId(req, res));
  router.post('/entry', (req, res) => controller.registerEntry(req, res));
  router.post('/exit', (req, res) => controller.registerExit(req, res));

  return router;
}
