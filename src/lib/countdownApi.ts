// Frontend API service for countdown timer
const API_BASE_URL = 'http://localhost:5000/api/v1';

export interface CountdownSettings {
  target_date: string;
  title: string;
  description: string;
  is_active: boolean;
}

export const getCountdownSettings = async (): Promise<CountdownSettings> => {
  try {
    const response = await fetch(`${API_BASE_URL}/countdown`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching countdown settings:', error);
    
    // Return default settings if API fails
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30); // 30 days from now
    
    return {
      // Keep as full ISO string so browsers parse consistently
      target_date: defaultDate.toISOString(),
      title: 'Memechain Presale',
      description: 'Get ready for the biggest meme coin presale!',
      is_active: true
    };
  }
};
