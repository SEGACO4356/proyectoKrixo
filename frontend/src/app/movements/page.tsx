'use client';

import { useState } from 'react';
import { Header } from '@/presentation/components/layout';
import { 
  Button, 
  Card, 
  Input, 
  Select, 
  Modal, 
  Badge, 
  LoadingSpinner, 
  EmptyState 
} from '@/presentation/components/ui';
import { useMovements, useProducts } from '@/application/hooks';
import type { CreateMovementInput } from '@/domain/entities';
import { showSuccessAlert, showErrorAlert, showWarningAlert } from '@/infrastructure/utils/alerts';

export default function MovementsPage() {
  const { movements, loading, error, registerEntry, registerExit, fetchMovements } = useMovements();
  const { products, fetchProducts } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movementType, setMovementType] = useState<'entry' | 'exit'>('entry');
  const [formData, setFormData] = useState<CreateMovementInput>({
    productId: '',
    quantity: 1,
    reason: '',
    reference: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = (type: 'entry' | 'exit') => {
    setMovementType(type);
    setFormData({
      productId: '',
      quantity: 1,
      reason: '',
      reference: '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.productId) {
      showWarningAlert('Por favor selecciona un producto');
      return;
    }

    if (formData.quantity <= 0) {
      showWarningAlert('La cantidad debe ser mayor a 0');
      return;
    }

    if (!formData.reason.trim()) {
      showWarningAlert('Por favor indica la razón del movimiento');
      return;
    }

    // Para salidas, verificar stock disponible
    if (movementType === 'exit') {
      const product = products.find(p => p.id === formData.productId);
      if (product && product.stock < formData.quantity) {
        showErrorAlert(
          `Stock insuficiente. Disponible: ${product.stock}, Intentando sacar: ${formData.quantity}`,
          'Stock Insuficiente'
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (movementType === 'entry') {
        await registerEntry(formData);
        await showSuccessAlert(
          `Se agregaron ${formData.quantity} unidades al inventario`,
          '¡Entrada Registrada!'
        );
      } else {
        await registerExit(formData);
        await showSuccessAlert(
          `Se retiraron ${formData.quantity} unidades del inventario`,
          '¡Salida Registrada!'
        );
      }
      await fetchProducts(); // Refresh products to update stock
      handleCloseModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar movimiento';
      await showErrorAlert(errorMessage, 'Error al Registrar Movimiento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Producto desconocido';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Movimientos"
        subtitle="Registro de entradas y salidas de inventario"
        action={
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="success" onClick={() => handleOpenModal('entry')}>
              + Entrada
            </Button>
            <Button variant="danger" onClick={() => handleOpenModal('exit')}>
              - Salida
            </Button>
          </div>
        }
      />

      <div className="p-4 sm:p-6 space-y-6">
        {movements.length > 0 ? (
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Razón
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referencia
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {movements.map((movement) => (
                    <tr key={movement.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge variant={movement.type === 'ENTRY' ? 'success' : 'danger'}>
                          {movement.type === 'ENTRY' ? '📥 Entrada' : '📤 Salida'}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getProductName(movement.productId)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={movement.type === 'ENTRY' ? 'text-green-600' : 'text-red-600'}>
                          {movement.type === 'ENTRY' ? '+' : '-'}{movement.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {movement.reason}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {movement.reference || '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(movement.createdAt).toLocaleString('es-ES')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card>
            <EmptyState
              icon="🔄"
              title="No hay movimientos"
              description="Registra entradas y salidas de productos para verlos aquí"
              action={
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button variant="success" onClick={() => handleOpenModal('entry')}>
                    + Entrada
                  </Button>
                  <Button variant="danger" onClick={() => handleOpenModal('exit')}>
                    - Salida
                  </Button>
                </div>
              }
            />
          </Card>
        )}
      </div>

      {/* Movement Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={movementType === 'entry' ? '📥 Registrar Entrada' : '📤 Registrar Salida'}
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button 
              variant={movementType === 'entry' ? 'success' : 'danger'}
              onClick={handleSubmit} 
              isLoading={isSubmitting}
            >
              Registrar {movementType === 'entry' ? 'Entrada' : 'Salida'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Producto"
            options={products.map(p => ({ value: p.id, label: `${p.name} (Stock: ${p.stock})` }))}
            value={formData.productId}
            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
            placeholder="Selecciona un producto"
            required
          />
          <Input
            label="Cantidad"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
            required
          />
          <Input
            label="Razón"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder={movementType === 'entry' ? 'Ej: Compra a proveedor' : 'Ej: Producto dañado'}
            required
          />
          <Input
            label="Referencia (opcional)"
            value={formData.reference || ''}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            placeholder="Ej: Factura #123"
          />
        </form>
      </Modal>
    </div>
  );
}
