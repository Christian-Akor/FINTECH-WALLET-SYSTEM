export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  accountNumber: string;
  balance: number;
  isVerified: boolean;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  data: User;
}

export interface Transaction {
  _id: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    accountNumber: string;
  };
  recipient: {
    _id: string;
    firstName: string;
    lastName: string;
    accountNumber: string;
  };
  amount: number;
  type: string;
  status: string;
  description: string;
  reference: string;
  balanceAfter: {
    sender: number;
    recipient: number;
  };
  metadata: {
    senderAccountNumber: string;
    recipientAccountNumber: string;
    senderName: string;
    recipientName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TransactionResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Transaction[];
}

export interface TransferRequest {
  recipientAccountNumber: string;
  amount: number;
  pin: string;
  description?: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  pin: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
