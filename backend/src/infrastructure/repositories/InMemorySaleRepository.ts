import { Sale } from '../../domain/entities/Sale';
import { ISaleRepository } from '../../domain/repositories/ISaleRepository';

export class InMemorySaleRepository implements ISaleRepository {
  private sales: Map<string, Sale> = new Map();

  async findAll(): Promise<Sale[]> {
    return Array.from(this.sales.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async findById(id: string): Promise<Sale | null> {
    return this.sales.get(id) || null;
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    return Array.from(this.sales.values())
      .filter(sale => {
        const saleDate = sale.createdAt;
        return saleDate >= startDate && saleDate <= endDate;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByCustomerEmail(email: string): Promise<Sale[]> {
    return Array.from(this.sales.values())
      .filter(sale => sale.customerEmail?.toLowerCase() === email.toLowerCase())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async save(sale: Sale): Promise<Sale> {
    this.sales.set(sale.id, sale);
    return sale;
  }

  async getTotalSales(startDate?: Date, endDate?: Date): Promise<number> {
    let sales = Array.from(this.sales.values());
    
    if (startDate && endDate) {
      sales = sales.filter(sale => {
        const saleDate = sale.createdAt;
        return saleDate >= startDate && saleDate <= endDate;
      });
    }

    return sales.reduce((total, sale) => total + sale.total, 0);
  }
}
