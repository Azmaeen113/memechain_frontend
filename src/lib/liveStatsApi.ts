const API_BASE_URL = 'http://localhost:5000/api/v1';

export interface LiveStats {
  participants: number;
  raised_amount: number;
  tokens_allocated: string;
  days_to_launch: number;
  is_active: boolean;
}

export const getLiveStats = async (): Promise<LiveStats> => {
  const url = `${API_BASE_URL}/live-stats`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};
