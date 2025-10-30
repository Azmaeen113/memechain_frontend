import { useState, useEffect } from 'react';
import { priceService, TokenSymbol } from '@/lib/priceService';

// React hook for price data
export function useTokenPrices() {
  const [prices, setPrices] = useState<Record<TokenSymbol, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedPrices = await priceService.getAllPrices();
        setPrices(fetchedPrices);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch prices');
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    
    // Refresh prices every 30 seconds
    const interval = setInterval(fetchPrices, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { prices, loading, error };
}


