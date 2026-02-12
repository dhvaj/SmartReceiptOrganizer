export interface Receipt {
  id: string;
  vendor: string;
  amount: number;
  tax: number;
  currency: string;
  category: string;
  date: string;
  imageUrl?: string;
}

export enum ReceiptCategory {
  DINING = "Dining",
  TRAVEL = "Travel",
  SUPPLIES = "Supplies",
  GROCERIES = "Groceries",
  ENTERTAINMENT = "Entertainment",
  UTILITIES = "Utilities",
  OTHER = "Other"
}

export interface ProcessingStatus {
  isProcessing: boolean;
  error?: string;
}