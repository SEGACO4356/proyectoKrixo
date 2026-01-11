import { Sale } from '../entities/Sale';

export interface ISaleRepository {
  findAll(): Promise<Sale[]>;
  findById(id: string): Promise<Sale | null>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Sale[]>;
  findByCustomerEmail(email: string): Promise<Sale[]>;
  save(sale: Sale): Promise<Sale>;
  getTotalSales(startDate?: Date, endDate?: Date): Promise<number>;
}
