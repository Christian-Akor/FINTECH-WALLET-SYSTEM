'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { walletService } from '@/services/walletService';
import { userService } from '@/services/userService';
import toast from 'react-hot-toast';
import { User as UserIcon, CheckCircle } from 'lucide-react';

export default function TransferPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [recipient, setRecipient] = useState<{ firstName: string; lastName: string; accountNumber: string } | null>(null);
  const [formData, setFormData] = useState({
    recipientAccountNumber: '',
    amount: '',
    pin: '',
    description: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const verifyAccount = async () => {
    if (formData.recipientAccountNumber.length < 10) {
      return;
    }

    setVerifying(true);
    try {
      const response = await userService.getUserByAccountNumber(formData.recipientAccountNumber);
      setRecipient(response.data as any);
      toast.success('Account verified!');
    } catch (error: any) {
      toast.error('Account not found');
      setRecipient(null);
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient) {
      toast.error('Please verify the recipient account first');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    if (user && parseFloat(formData.amount) > user.balance) {
      toast.error('Insufficient balance');
      return;
    }

    setLoading(true);

    try {
      await walletService.transfer({
        recipientAccountNumber: formData.recipientAccountNumber,
        amount: parseFloat(formData.amount),
        pin: formData.pin,
        description: formData.description,
      });

      toast.success('Transfer successful!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Transfer failed');
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Send Money</h1>
          <p className="text-gray-600 mb-8">Transfer funds to another wallet</p>

          {/* Balance Info */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <p className="text-sm text-gray-600 mb-2">Available Balance</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(user.balance)}</p>
          </div>

          {/* Transfer Form */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      label="Recipient Account Number"
                      type="text"
                      value={formData.recipientAccountNumber}
                      onChange={(e) => {
                        setFormData({ ...formData, recipientAccountNumber: e.target.value });
                        setRecipient(null);
                      }}
                      required
                      placeholder="3012345678"
                    />
                  </div>
                  <div className="pt-8">
                    <Button
                      type="button"
                      onClick={verifyAccount}
                      loading={verifying}
                      disabled={formData.recipientAccountNumber.length < 10}
                    >
                      Verify
                    </Button>
                  </div>
                </div>
                
                {recipient && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                    <CheckCircle className="text-green-600" size={24} />
                    <div>
                      <p className="font-semibold text-green-900">
                        {recipient.firstName} {recipient.lastName}
                      </p>
                      <p className="text-sm text-green-700">Account verified</p>
                    </div>
                  </div>
                )}
              </div>

              <Input
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                min="1"
                step="0.01"
                placeholder="0.00"
              />

              <Input
                label="Description (Optional)"
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What's this for?"
              />

              <Input
                label="Transaction PIN"
                type="password"
                value={formData.pin}
                onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                required
                maxLength={4}
                placeholder="Enter your 4-digit PIN"
              />

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push('/dashboard')}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  disabled={!recipient}
                  fullWidth
                >
                  Send Money
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
