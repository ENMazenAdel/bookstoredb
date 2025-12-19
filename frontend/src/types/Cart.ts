import { Book } from './Book';

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface CheckoutData {
  creditCardNumber: string;
  expiryDate: string;
  cvv: string;
}
