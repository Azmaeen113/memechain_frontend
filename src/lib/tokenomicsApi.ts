const API_BASE_URL = 'http://localhost:5000/api/v1';

export interface Tokenomics {
  total_supply: number;
  presale_stage1_price: number;
  presale_stage2_price: number;
  presale_stage3_price: number;
  presale_stage4_price: number;
  presale_stage5_price: number;
  public_sale_price: number;
  distribution: {
    team: number;
    presale: number;
    liquidity: number;
    marketing: number;
    reserve: number;
    community: number;
  };
  is_active: boolean;
}

export const getTokenomics = async (): Promise<Tokenomics> => {
  const url = `${API_BASE_URL}/tokenomics`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

