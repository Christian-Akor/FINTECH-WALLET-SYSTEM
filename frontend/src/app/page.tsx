'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Wallet, Send, Shield, Clock } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-3xl font-bold text-blue-600">FinWallet</h1>
          <div className="space-x-4">
            <Link href="/login" className="px-6 py-2 text-blue-600 hover:text-blue-700 font-semibold">
              Login
            </Link>
            <Link href="/register" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
              Sign Up
            </Link>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Digital Wallet,<br />Simplified
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Send money, manage your finances, and track transactions all in one secure platform
          </p>
          <Link href="/register" className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg">
            Get Started Free
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Wallet className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Wallet</h3>
            <p className="text-gray-600">Your money is safe with bank-level security</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Send className="text-green-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Transfers</h3>
            <p className="text-gray-600">Send money to anyone instantly</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="text-purple-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Protected</h3>
            <p className="text-gray-600">PIN protection on every transaction</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Clock className="text-orange-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">24/7 Available</h3>
            <p className="text-gray-600">Access your wallet anytime, anywhere</p>
          </div>
        </div>
      </div>
    </div>
  );
}
