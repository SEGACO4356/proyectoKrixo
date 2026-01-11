-- Create Products table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sku VARCHAR(100) UNIQUE NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL CHECK (stock >= 0),
    min_stock INTEGER NOT NULL CHECK (min_stock >= 0),
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Movements table
CREATE TABLE IF NOT EXISTS movements (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('ENTRY', 'EXIT', 'ADJUSTMENT')),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    reason TEXT NOT NULL,
    reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create Sales table
CREATE TABLE IF NOT EXISTS sales (
    id VARCHAR(36) PRIMARY KEY,
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Sale Items table
CREATE TABLE IF NOT EXISTS sale_items (
    id SERIAL PRIMARY KEY,
    sale_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_stock ON products(stock);
CREATE INDEX idx_movements_product_id ON movements(product_id);
CREATE INDEX idx_movements_type ON movements(type);
CREATE INDEX idx_movements_created_at ON movements(created_at);
CREATE INDEX idx_sales_created_at ON sales(created_at);
CREATE INDEX idx_sales_customer_email ON sales(customer_email);
CREATE INDEX idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX idx_sale_items_product_id ON sale_items(product_id);

-- Insert sample data
INSERT INTO products (id, name, description, sku, price, stock, min_stock, category) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Laptop Dell XPS 15', 'Portátil de alto rendimiento', 'LAPTOP-DELL-001', 1299.99, 15, 5, 'electronics'),
('550e8400-e29b-41d4-a716-446655440002', 'Mouse Logitech MX Master', 'Mouse ergonómico inalámbrico', 'MOUSE-LOG-001', 99.99, 30, 10, 'electronics'),
('550e8400-e29b-41d4-a716-446655440003', 'Teclado Mecánico RGB', 'Teclado gaming con luces RGB', 'KEYBOARD-001', 149.99, 20, 5, 'electronics'),
('550e8400-e29b-41d4-a716-446655440004', 'Monitor LG 27" 4K', 'Monitor UHD con HDR', 'MONITOR-LG-001', 449.99, 8, 3, 'electronics'),
('550e8400-e29b-41d4-a716-446655440005', 'Auriculares Sony WH-1000XM5', 'Cancelación de ruido premium', 'HEADPHONES-001', 349.99, 12, 5, 'electronics');
