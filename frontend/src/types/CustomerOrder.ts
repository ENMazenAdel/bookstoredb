export interface CustomerOrderItem {
  isbn: string;
  title: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

export interface CustomerOrder {
  id: string;
  customerId: string; // Link order to a specific customer
  orderDate: string;
  items: CustomerOrderItem[];
  totalAmount: number;
  status: 'Completed' | 'Processing' | 'Cancelled';
}
