'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { walletService } from '@/services/walletService';
import { Transaction } from '@/types';
import { ArrowUpRight, ArrowDownLeft, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TransactionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, page]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await walletService.getTransactions(page, 10);
      setTransactions(response.data);
      setTotalPages(response.pages);
    } catch (error: any) {
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const isSender = transaction.sender._id === user.id;
    const otherParty = isSender ? transaction.recipient : transaction.sender;
    const searchLower = searchTerm.toLowerCase();

    return (
      transaction.reference.toLowerCase().includes(searchLower) ||
      `${otherParty.firstName} ${otherParty.lastName}`.toLowerCase().includes(searchLower) ||
      otherParty.accountNumber.includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction History</h1>
          <p className="text-gray-600 mb-8">View all your transactions</p>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, account number, or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-xl shadow-md">
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <p className="text-center text-gray-500 py-12">No transactions found</p>
            ) : (
              <>
                <div className="divide-y">
                  {filteredTransactions.map((transaction) => {
                    const isSender = transaction.sender._id === user.id;
                    const otherParty = isSender ? transaction.recipient : transaction.sender;
                    
                    return (
                      <div key={transaction._id} className="p-6 hover:bg-gray-50 transition">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              isSender ? 'bg-red-100' : 'bg-green-100'
                            }`}>
                              {isSender ? (
                                <ArrowUpRight className="text-red-600" size={24} />
                              ) : (
                                <ArrowDownLeft className="text-green-600" size={24} />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">
                                {isSender ? 'Sent to' : 'Received from'} {otherParty.firstName} {otherParty.lastName}
                              </p>
                              <p className="text-sm text-gray-500">
                                Account: {otherParty.accountNumber}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatDate(transaction.createdAt)}
                              </p>
                              <p className="text-xs text-gray-400">
                                Ref: {transaction.reference}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-xl font-bold ${
                              isSender ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {isSender ? '-' : '+'}{formatCurrency(transaction.amount)}
                            </p>
                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                              transaction.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : transaction.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.status}
                            </span>
                          </div>
                        </div>
                        {transaction.description && (
                          <p className="text-sm text-gray-600 mt-3 ml-16">{transaction.description}</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-6 border-t flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                      className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
