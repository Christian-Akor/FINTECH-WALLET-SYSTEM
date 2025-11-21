import api from '@/lib/api';
import { TransactionResponse, Transaction, TransferRequest } from '@/types';

export const walletService = {
  async getBalance(): Promise<{ success: boolean; data: { balance: number; accountNumber: string } }> {
    const response = await api.get('/wallet/balance');
    return response.data;
  },

  async transfer(data: TransferRequest): Promise<{ success: boolean; message: string; data: Transaction }> {
    const response = await api.post('/wallet/transfer', data);
    return response.data;
  },

  async getTransactions(page: number = 1, limit: number = 20): Promise<TransactionResponse> {
    const response = await api.get('/wallet/transactions', {
      params: { page, limit },
    });
    return response.data;
  },

  async getTransaction(id: string): Promise<{ success: boolean; data: Transaction }> {
    const response = await api.get(`/wallet/transactions/${id}`);
    return response.data;
  },

  async getTransactionByReference(reference: string): Promise<{ success: boolean; data: Transaction }> {
    const response = await api.get(`/wallet/transactions/reference/${reference}`);
    return response.data;
  },
};
