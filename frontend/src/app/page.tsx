'use client';

import { Header } from '@/presentation/components/layout';
import { StatCard, Card, Badge, LoadingSpinner, EmptyState } from '@/presentation/components/ui';
import { useDashboard } from '@/application/hooks';

export default function DashboardPage() {
  const { stats, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <EmptyState
          icon="⚠️"
          title="Error al cargar datos"
          description={error}
        />
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Resumen general del inventario"
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Productos"
            value={stats?.totalProducts ?? 0}
            icon="📦"
            color="blue"
          />
          <StatCard
            title="Stock Total"
            value={stats?.totalStock ?? 0}
            icon="📊"
            color="green"
          />
          <StatCard
            title="Ventas Realizadas"
            value={stats?.totalSales ?? 0}
            icon="💰"
            color="purple"
          />
          <StatCard
            title="Ingresos Totales"
            value={`$${(stats?.totalRevenue ?? 0).toLocaleString()}`}
            icon="💵"
            color="green"
          />
        </div>

        {/* Alerts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatCard
            title="Productos con Stock Bajo"
            value={stats?.lowStockCount ?? 0}
            icon="⚠️"
            color={stats?.lowStockCount && stats.lowStockCount > 0 ? 'red' : 'green'}
          />
          <StatCard
            title="Movimientos Hoy"
            value={stats?.todayMovementsCount ?? 0}
            icon="🔄"
            color="blue"
          />
        </div>

        {/* Low Stock Products */}
        {stats?.lowStockProducts && stats.lowStockProducts.length > 0 && (
          <Card title="⚠️ Productos con Stock Bajo" subtitle="Requieren reabastecimiento">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock Actual
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock Mínimo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.lowStockProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.stock}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.minStock}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge variant={product.stock === 0 ? 'danger' : 'warning'}>
                          {product.stock === 0 ? 'Sin Stock' : 'Stock Bajo'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Empty state when no data */}
        {(!stats || stats.totalProducts === 0) && (
          <Card>
            <EmptyState
              icon="📦"
              title="Sin productos en el inventario"
              description="Comienza agregando productos para ver las estadísticas del dashboard"
            />
          </Card>
        )}
      </div>
    </div>
  );
}
