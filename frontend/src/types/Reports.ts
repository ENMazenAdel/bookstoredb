export interface SalesReport {
  totalSales: number;
  totalOrders: number;
  period: string;
}

export interface BookSalesReport {
  isbn: string;
  title: string;
  copiesSold: number;
  totalRevenue: number;
}

export interface TopCustomer {
  customerId: string;
  customerName: string;
  email: string;
  totalPurchaseAmount: number;
  orderCount: number;
}

export interface BookOrderCount {
  isbn: string;
  title: string;
  orderCount: number;
}
