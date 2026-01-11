// Dashboard types
export interface DashboardStats {
  totalProducts: number;
  totalStock: number;
  totalSales: number;
  totalRevenue: number;
  lowStockCount: number;
  todayMovementsCount: number;
  lowStockProducts: {
    id: string;
    name: string;
    stock: number;
    minStock: number;
  }[];
}
