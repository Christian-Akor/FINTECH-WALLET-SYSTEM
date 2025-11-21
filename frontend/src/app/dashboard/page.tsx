'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { walletService } from '@/services/walletService';
import { Transaction } from '@/types';
import { Wallet, Send, TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        walletService.getBalance(),
        walletService.getTransactions(1, 5),
      ]);
      
      setBalance(balanceRes.data.balance);
      setTransactions(transactionsRes.data);
    } catch (error: any) {
      toast.error('Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">Here&apos;s your wallet overview</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Wallet size={24} />
              <span className="text-lg opacity-90">Total Balance</span>
            </div>
            <TrendingUp size={24} className="opacity-80" />
          </div>
          <h2 className="text-5xl font-bold mb-4">{formatCurrency(balance)}</h2>
          <p className="text-blue-100">Account: {user.accountNumber}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/transfer" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Send className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Send Money</h3>
            <p className="text-gray-600">Transfer to another wallet</p>
          </Link>

          <Link href="/transactions" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Transactions</h3>
            <p className="text-gray-600">View transaction history</p>
          </Link>

          <Link href="/profile" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Wallet className="text-purple-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Profile</h3>
            <p className="text-gray-600">Manage your account</p>
          </Link>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Recent Transactions</h3>
            <Link href="/transactions" className="text-blue-600 hover:text-blue-700 font-semibold">
              View All
            </Link>
          </div>

          {transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No transactions yet</p>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => {
                const isSender = transaction.sender._id === user.id;
                const otherParty = isSender ? transaction.recipient : transaction.sender;
                
                return (
                  <div key={transaction._id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isSender ? 'bg-red-100' : 'bg-green-100'
                      }`}>
                        {isSender ? (
                          <ArrowUpRight className="text-red-600" size={20} />
                        ) : (
                          <ArrowDownLeft className="text-green-600" size={20} />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {isSender ? 'Sent to' : 'Received from'} {otherParty.firstName} {otherParty.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${
                        isSender ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {isSender ? '-' : '+'}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-500">{transaction.status}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
