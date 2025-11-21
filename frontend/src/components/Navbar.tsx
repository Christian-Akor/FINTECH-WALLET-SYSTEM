'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Send, History, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            FinWallet
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition">
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
            <Link href="/transfer" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition">
              <Send size={20} />
              <span>Transfer</span>
            </Link>
            <Link href="/transactions" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition">
              <History size={20} />
              <span>History</span>
            </Link>
            <Link href="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition">
              <User size={20} />
              <span>Profile</span>
            </Link>
            <button onClick={handleLogout} className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>

          <div className="md:hidden">
            <button className="text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - simplified for now */}
      <div className="md:hidden bg-white border-t">
        <div className="container mx-auto px-4 py-2 flex justify-around">
          <Link href="/dashboard" className="flex flex-col items-center text-gray-700">
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/transfer" className="flex flex-col items-center text-gray-700">
            <Send size={20} />
            <span className="text-xs mt-1">Transfer</span>
          </Link>
          <Link href="/transactions" className="flex flex-col items-center text-gray-700">
            <History size={20} />
            <span className="text-xs mt-1">History</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-700">
            <User size={20} />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
