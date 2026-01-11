import { Request, Response } from 'express';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { ISaleRepository } from '../../../domain/repositories/ISaleRepository';
import { IMovementRepository } from '../../../domain/repositories/IMovementRepository';

export class DashboardController {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly saleRepository: ISaleRepository,
    private readonly movementRepository: IMovementRepository
  ) {}

  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productRepository.findAll();
      const sales = await this.saleRepository.findAll();
      const movements = await this.movementRepository.findAll();
      const lowStockProducts = await this.productRepository.findLowStock();

      const totalProducts = products.length;
      const totalStock = products.reduce((acc, product) => acc + product.stock, 0);
      const totalSales = sales.length;
      const totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0);
      const lowStockCount = lowStockProducts.length;

      // Get today's movements
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayMovements = movements.filter(m => {
        const movementDate = m.createdAt;
        return movementDate >= today && movementDate < tomorrow;
      });

      res.json({
        success: true,
        data: {
          totalProducts,
          totalStock,
          totalSales,
          totalRevenue,
          lowStockCount,
          todayMovementsCount: todayMovements.length,
          lowStockProducts: lowStockProducts.map(p => ({
            id: p.id,
            name: p.name,
            stock: p.stock,
            minStock: p.minStock,
          })),
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: message });
    }
  }
}
