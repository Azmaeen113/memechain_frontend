import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount } from 'wagmi';

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

interface UserContextType {
  userData: UserData | null;
  isLoading: boolean;
  error: string | null;
  isNewUser: boolean;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  refreshUserData: () => Promise<void>;
  clearUserData: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

const API_BASE_URL = 'http://localhost:5000/api';

export function UserProvider({ children }: UserProviderProps) {
  const { address, isConnected } = useAccount();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  /**
   * Get or create user when wallet connects
   */
  const getOrCreateUser = async (walletAddress: string) => {
    if (!walletAddress) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔗 Connecting user with wallet:', walletAddress);
      
      const response = await fetch(`${API_BASE_URL}/get_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletid: walletAddress,
          col1: 'wallet_connected',
          col2: new Date().toISOString(),
          col3: 'memechain_app'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setUserData(data.user);
        setIsNewUser(data.is_new_user);
        
        if (data.is_new_user) {
          console.log('🎉 New user created:', data.user);
          // You can add a toast notification here
        } else {
          console.log('👋 Welcome back:', data.user);
        }
      } else {
        throw new Error(data.error || 'Failed to get/create user');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('❌ Error getting/creating user:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update user data
   */
  const updateUserData = async (updateData: Partial<UserData>) => {
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setUserData(data.user);
        console.log('✅ User updated:', data.user);
      } else {
        throw new Error(data.error || 'Failed to update user');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('❌ Error updating user:', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh user data from server
   */
  const refreshUserData = async () => {
    if (address) {
      await getOrCreateUser(address);
    }
  };

  /**
   * Clear user data
   */
  const clearUserData = () => {
    setUserData(null);
    setIsNewUser(false);
    setError(null);
  };

  /**
   * Auto-connect user when wallet connects
   */
  useEffect(() => {
    if (isConnected && address) {
      // Only fetch if we don't have user data or if wallet address changed
      if (!userData || userData.walletid !== address) {
        getOrCreateUser(address);
      }
    } else if (!isConnected) {
      // Clear user data when wallet disconnects
      clearUserData();
    }
  }, [isConnected, address]);

  const value: UserContextType = {
    userData,
    isLoading,
    error,
    isNewUser,
    updateUserData,
    refreshUserData,
    clearUserData,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * Hook to use user context
 */
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

/**
 * Hook for user management actions
 */
export function useUserActions() {
  const { userData, updateUserData, refreshUserData } = useUser();

  /**
   * Mark user as paid
   */
  const markAsPaid = async (paymentData?: any) => {
    return updateUserData({
      paid: true,
      col1: 'payment_completed',
      col2: paymentData?.transactionHash || '',
      col3: paymentData?.amount || ''
    });
  };

  /**
   * Update user profile data
   */
  const updateProfile = async (profileData: any) => {
    return updateUserData({
      col1: profileData.col1 || userData?.col1 || '',
      col2: profileData.col2 || userData?.col2 || '',
      col3: profileData.col3 || userData?.col3 || ''
    });
  };

  return {
    markAsPaid,
    updateProfile,
    refreshUserData,
    userData
  };
}


