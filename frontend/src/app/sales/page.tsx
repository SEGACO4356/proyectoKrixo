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
import { useSales, useProducts } from '@/application/hooks';
import type { CreateSaleInput, CreateSaleItemInput } from '@/domain/entities';

export default function SalesPage() {
  const { sales, loading, createSale, fetchSales } = useSales();
  const { products, fetchProducts } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saleItems, setSaleItems] = useState<(CreateSaleItemInput & { name: string; price: number })[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableProducts = products.filter(p => p.stock > 0);

  const handleAddItem = () => {
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const existingItem = saleItems.find(item => item.productId === selectedProductId);
    if (existingItem) {
      setSaleItems(saleItems.map(item => 
        item.productId === selectedProductId 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setSaleItems([...saleItems, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
      }]);
    }

    setSelectedProductId('');
    setQuantity(1);
  };

  const handleRemoveItem = (productId: string) => {
    setSaleItems(saleItems.filter(item => item.productId !== productId));
  };

  const calculateTotal = () => {
    return saleItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const handleOpenModal = () => {
    setSaleItems([]);
    setCustomerName('');
    setCustomerEmail('');
    setNotes('');
    setSelectedProductId('');
    setQuantity(1);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (saleItems.length === 0) return;

    setIsSubmitting(true);

    try {
      const saleData: CreateSaleInput = {
        items: saleItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        customerName: customerName || undefined,
        customerEmail: customerEmail || undefined,
        notes: notes || undefined,
      };

      await createSale(saleData);
      await fetchProducts(); // Refresh products to update stock
      handleCloseModal();
    } catch (err) {
      console.error('Error creating sale:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Ventas"
        subtitle={`${sales.length} ventas realizadas`}
        action={
          <Button onClick={handleOpenModal}>
            + Nueva Venta
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {sales.length > 0 ? (
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Productos
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                        {sale.id.slice(0, 8)}...
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">
                            {sale.customerName || 'Cliente anónimo'}
                          </div>
                          {sale.customerEmail && (
                            <div className="text-sm text-gray-500">{sale.customerEmail}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {sale.items.map((item, idx) => (
                            <Badge key={idx} variant="info">
                              {item.productName} x{item.quantity}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                        ${sale.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(sale.createdAt).toLocaleString('es-ES')}
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
              icon="💰"
              title="No hay ventas"
              description="Registra tu primera venta para comenzar"
              action={
                <Button onClick={handleOpenModal}>
                  + Nueva Venta
                </Button>
              }
            />
          </Card>
        )}
      </div>

      {/* Sale Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="💰 Nueva Venta"
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              isLoading={isSubmitting}
              disabled={saleItems.length === 0}
            >
              Registrar Venta (${calculateTotal().toLocaleString()})
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          {/* Add Products */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Agregar Productos</h4>
            <div className="flex gap-2">
              <Select
                options={availableProducts.map(p => ({ 
                  value: p.id, 
                  label: `${p.name} - $${p.price} (${p.stock} disp.)` 
                }))}
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                placeholder="Selecciona un producto"
                className="flex-1"
              />
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-20"
              />
              <Button onClick={handleAddItem} disabled={!selectedProductId}>
                +
              </Button>
            </div>
          </div>

          {/* Sale Items */}
          {saleItems.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Productos en la venta</h4>
              <div className="border rounded-lg divide-y">
                {saleItems.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between p-3">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-500 ml-2">x{item.quantity}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">${(item.price * item.quantity).toLocaleString()}</span>
                      <Button 
                        size="sm" 
                        variant="danger" 
                        onClick={() => handleRemoveItem(item.productId)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between p-3 bg-gray-50 font-bold">
                  <span>Total</span>
                  <span className="text-green-600">${calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Customer Info */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Información del Cliente (opcional)</h4>
            <Input
              label="Nombre"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nombre del cliente"
            />
            <Input
              label="Email"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="email@ejemplo.com"
            />
            <Input
              label="Notas"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas adicionales..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
