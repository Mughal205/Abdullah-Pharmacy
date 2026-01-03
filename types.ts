
export interface Medicine {
  id: string;
  name: string;
  category: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  price: number;
  lowStockThreshold: number;
  manufacturer: string;
}

export interface SaleItem {
  medicineId: string;
  name: string;
  quantity: number;
  priceAtSale: number;
}

export interface Sale {
  id: string;
  timestamp: string;
  items: SaleItem[];
  totalAmount: number;
  customerName?: string;
}

export enum AppView {
  DASHBOARD = 'dashboard',
  INVENTORY = 'inventory',
  SALES = 'sales',
  REPORTS = 'reports',
  AI_ASSISTANT = 'ai_assistant'
}
