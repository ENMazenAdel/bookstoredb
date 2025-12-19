export type OrderStatus = 'Pending' | 'Confirmed' | 'Cancelled';

export interface PublisherOrder {
  id: string;
  bookIsbn: string;
  bookTitle: string;
  publisher: string;
  quantity: number;
  orderDate: string;
  status: OrderStatus;
}

export interface PublisherOrderFormData {
  bookIsbn: string;
  quantity: number;
}
