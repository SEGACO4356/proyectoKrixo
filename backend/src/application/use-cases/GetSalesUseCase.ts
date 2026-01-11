import { Sale } from '../../domain/entities/Sale';
import { ISaleRepository } from '../../domain/repositories/ISaleRepository';
import { SaleResponseDTO } from '../dtos/SaleDTO';

export class GetSalesUseCase {
  constructor(private readonly saleRepository: ISaleRepository) {}

  async execute(): Promise<SaleResponseDTO[]> {
    const sales = await this.saleRepository.findAll();
    return sales.map(this.toResponseDTO);
  }

  async executeById(id: string): Promise<SaleResponseDTO | null> {
    const sale = await this.saleRepository.findById(id);
    if (!sale) return null;
    return this.toResponseDTO(sale);
  }

  async executeByDateRange(startDate: Date, endDate: Date): Promise<SaleResponseDTO[]> {
    const sales = await this.saleRepository.findByDateRange(startDate, endDate);
    return sales.map(this.toResponseDTO);
  }

  private toResponseDTO(sale: Sale): SaleResponseDTO {
    return {
      id: sale.id,
      items: sale.items.map(item => item.toJSON()),
      total: sale.total,
      customerName: sale.customerName,
      customerEmail: sale.customerEmail,
      notes: sale.notes,
      itemCount: sale.itemCount,
      createdAt: sale.createdAt.toISOString(),
    };
  }
}
