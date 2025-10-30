// Frontend API Service - Updated to use Backend API
// Replace Supabase calls with backend API calls

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Helper function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// Presale API Functions
export const getPresaleStatus = async () => {
  // Compose presale status from public endpoints
  const [live, tokenomics] = await Promise.all([
    apiCall('/live-stats').catch(() => null),
    apiCall('/tokenomics').catch(() => null),
  ]);

  const currentPrice = tokenomics?.presale_stage1_price ?? 0.00001;
  const totalRaised = live?.raised_amount ?? 125000;
  const totalParticipants = live?.participants ?? 847;
  const hardCap = 1000000; // default goal; adjust if backend adds this

  return {
    success: true,
    data: {
      currentPrice,
      totalRaised,
      totalParticipants,
      hardCap,
    },
  };
};

export const connectWallet = async (walletAddress: string, chain: string) => {
  return apiCall('/presale/connect-wallet', {
    method: 'POST',
    body: JSON.stringify({ walletAddress, chain }),
  });
};

export const processPurchase = async (data: {
  walletAddress: string;
  amount: number;
  chain: string;
  txHash: string;
}) => {
  return apiCall('/presale/purchase', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getUserData = async (walletAddress: string) => {
  return apiCall(`/presale/user/${walletAddress}`);
};

export const getLiveStats = async () => {
  const res = await apiCall('/live-stats');
  // Map backend fields to frontend expectations
  return {
    success: true,
    data: {
      totalRaised: res.raised_amount,
      totalParticipants: res.participants,
      tokensAllocated: res.tokens_allocated,
      daysToLaunch: res.days_to_launch,
    },
  };
};

// Newsletter API
export const subscribeNewsletter = async (email: string) => {
  return apiCall('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

// Admin API Functions
export const adminLogin = async (email: string, password: string) => {
  return apiCall('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const getDashboardStats = async (token: string) => {
  return apiCall('/admin/dashboard/stats', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export const getParticipants = async (token: string, page = 1, limit = 50) => {
  return apiCall(`/admin/participants?page=${page}&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export const getTransactions = async (token: string, page = 1, limit = 50) => {
  return apiCall(`/admin/transactions?page=${page}&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export const updatePresaleStage = async (token: string, stage: number) => {
  return apiCall('/admin/presale/update-stage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ stage }),
  });
};

export const updatePresalePrice = async (token: string, stage: number, price: number) => {
  return apiCall('/admin/presale/update-price', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ stage, price }),
  });
};

export const togglePresaleStatus = async (token: string, isActive: boolean) => {
  return apiCall('/admin/presale/toggle-status', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ isActive }),
  });
};

export const getAnalytics = async (token: string, startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  return apiCall(`/admin/analytics/overview?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

// Export default for backward compatibility
export default {
  getPresaleStatus,
  connectWallet,
  processPurchase,
  getUserData,
  getLiveStats,
  subscribeNewsletter,
  adminLogin,
  getDashboardStats,
  getParticipants,
  getTransactions,
  updatePresaleStage,
  updatePresalePrice,
  togglePresaleStatus,
  getAnalytics,
};
