// types/order.ts
export type OrderStatus = 'completed' | 'pending' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  orderDate: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  tax?: number;
  shipping?: number;
  discount?: number;
  notes?: string;
  paymentMethod: string;
  deliveryMethod?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}
