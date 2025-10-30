import React, { useState, useEffect } from 'react';
import { useWalletConnection } from '@/components/ConnectWalletButton';

interface UserData {
  id: number;
  walletid: string;
  paid: boolean;
  col1: string;
  col2: string;
  col3: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  user: UserData;
  is_new_user?: boolean;
  message: string;
}

/**
 * Hook for managing user data with backend API
 */
export function useUserManagement() {
  const { address, isConnected } = useWalletConnection();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  /**
   * Get or create user when wallet connects
   */
  const getOrCreateUser = async (walletAddress: string, additionalData?: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/get_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletid: walletAddress,
          ...additionalData
        })
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        setUserData(data.user);
        
        if (data.is_new_user) {
          console.log('🎉 New user created:', data.user);
          // You can show a welcome message here
        } else {
          console.log('👋 Welcome back:', data.user);
        }
        
        return data.user;
      } else {
        throw new Error(data.message || 'Failed to get/create user');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error getting/creating user:', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update user data
   */
  const updateUser = async (updateData: Partial<UserData>) => {
    if (!address) {
      throw new Error('No wallet connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/update_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletid: address,
          ...updateData
        })
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        setUserData(data.user);
        console.log('✅ User updated:', data.user);
        return data.user;
      } else {
        throw new Error(data.message || 'Failed to update user');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error updating user:', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Mark user as paid
   */
  const markAsPaid = async (paymentData?: any) => {
    return updateUser({
      paid: true,
      col1: 'payment_completed',
      col2: paymentData?.transactionHash || '',
      col3: paymentData?.amount || ''
    });
  };

  /**
   * Auto-connect user when wallet connects
   */
  useEffect(() => {
    if (isConnected && address && !userData) {
      getOrCreateUser(address, {
        col1: 'wallet_connected',
        col2: new Date().toISOString()
      }).catch(console.error);
    }
  }, [isConnected, address, userData]);

  return {
    userData,
    isLoading,
    error,
    getOrCreateUser,
    updateUser,
    markAsPaid,
    isConnected,
    address
  };
}

/**
 * Component for displaying user information
 */
export function UserProfile() {
  const { userData, isLoading, error, markAsPaid } = useUserManagement();

  const handlePayment = async () => {
    try {
      await markAsPaid({
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
        amount: '0.1 ETH'
      });
      alert('Payment recorded successfully!');
    } catch (err) {
      alert('Failed to record payment');
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading user data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!userData) {
    return <div className="p-4">Please connect your wallet</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      
      <div className="space-y-3">
        <div>
          <span className="font-semibold">Wallet Address:</span>
          <p className="font-mono text-sm bg-gray-100 p-2 rounded">
            {userData.walletid}
          </p>
        </div>
        
        <div>
          <span className="font-semibold">Payment Status:</span>
          <span className={`ml-2 px-2 py-1 rounded text-sm ${
            userData.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {userData.paid ? 'Paid' : 'Unpaid'}
          </span>
        </div>
        
        <div>
          <span className="font-semibold">Additional Data:</span>
          <div className="mt-1 space-y-1">
            {userData.col1 && <p className="text-sm">Col1: {userData.col1}</p>}
            {userData.col2 && <p className="text-sm">Col2: {userData.col2}</p>}
            {userData.col3 && <p className="text-sm">Col3: {userData.col3}</p>}
          </div>
        </div>
        
        <div>
          <span className="font-semibold">Member Since:</span>
          <p className="text-sm text-gray-600">
            {new Date(userData.created_at).toLocaleDateString()}
          </p>
        </div>
        
        {!userData.paid && (
          <button
            onClick={handlePayment}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Mark as Paid (Test)
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Component for displaying user statistics
 */
export function UserStats() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user_stats');
        const data = await response.json();
        
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="p-4">Loading statistics...</div>;
  }

  if (!stats) {
    return <div className="p-4">Failed to load statistics</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">User Statistics</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.total_users}</div>
          <div className="text-sm text-gray-600">Total Users</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">{stats.paid_users}</div>
          <div className="text-sm text-gray-600">Paid Users</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">{stats.unpaid_users}</div>
          <div className="text-sm text-gray-600">Unpaid Users</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">{stats.recent_users_24h}</div>
          <div className="text-sm text-gray-600">New (24h)</div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Last updated: {new Date(stats.last_updated).toLocaleString()}
      </div>
    </div>
  );
}

