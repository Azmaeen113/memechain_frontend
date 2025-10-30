import { formatUnits } from 'viem';

// Token configurations
export const SUPPORTED_TOKENS = {
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    coingeckoId: 'tether',
    icon: '💵',
    chains: {
      1: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // Ethereum
      56: '0x55d398326f99059fF775485246999027B3197955', // BSC
      137: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // Polygon
      8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base
      42161: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // Arbitrum
    }
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    coingeckoId: 'ethereum',
    icon: '🔷',
    chains: {
      1: '0x0000000000000000000000000000000000000000', // Native ETH
      56: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', // BSC WETH
      137: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f688', // Polygon WETH
      8453: '0x4200000000000000000000000000000000000006', // Base WETH
      42161: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', // Arbitrum WETH
    }
  },
  BNB: {
    symbol: 'BNB',
    name: 'Binance Coin',
    decimals: 18,
    coingeckoId: 'binancecoin',
    icon: '🟡',
    chains: {
      56: '0x0000000000000000000000000000000000000000', // Native BNB
    }
  },
  MATIC: {
    symbol: 'MATIC',
    name: 'Polygon',
    decimals: 18,
    coingeckoId: 'polygon-ecosystem-token',
    icon: '🟣',
    chains: {
      137: '0x0000000000000000000000000000000000000000', // Native MATIC
    }
  },
  ARB: {
    symbol: 'ARB',
    name: 'Arbitrum',
    decimals: 18,
    coingeckoId: 'arbitrum',
    icon: '🔵',
    chains: {
      42161: '0x0000000000000000000000000000000000000000', // ARB on Arbitrum (placeholder for display)
    }
  }
} as const;

export type TokenSymbol = keyof typeof SUPPORTED_TOKENS;

// MemeChain token configuration
export const MEMECHAIN_TOKEN = {
  symbol: 'MEME',
  name: 'MemeChain Token',
  price: 0.5, // Static price in USD
  decimals: 18,
  icon: '🚀'
};

// Price fetching service
class PriceService {
  private cache: Map<string, { price: number; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30000; // 30 seconds

  /**
   * Get live price for a token from CoinGecko
   */
  async getTokenPrice(tokenId: string): Promise<number> {
    const cacheKey = tokenId;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.price;
    }

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const price = data[tokenId]?.usd;
      
      if (typeof price !== 'number') {
        throw new Error(`Invalid price data for ${tokenId}`);
      }
      
      // Cache the price
      this.cache.set(cacheKey, { price, timestamp: Date.now() });
      
      return price;
    } catch (error) {
      console.error(`Error fetching price for ${tokenId}:`, error);
      
      // Return cached price if available, otherwise fallback
      if (cached) {
        return cached.price;
      }
      
      // Fallback prices (approximate)
      const fallbackPrices: Record<string, number> = {
        'tether': 1.0,
        'ethereum': 3000,
        'binancecoin': 300,
        'polygon-ecosystem-token': 0.8,
      };
      
      return fallbackPrices[tokenId] || 1;
    }
  }

  /**
   * Get prices for all supported tokens
   */
  async getAllPrices(): Promise<Record<TokenSymbol, number>> {
    const tokenIds = Object.values(SUPPORTED_TOKENS).map(token => token.coingeckoId);
    const uniqueIds = [...new Set(tokenIds)];
    
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${uniqueIds.join(',')}&vs_currencies=usd`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const prices: Record<TokenSymbol, number> = {} as any;
      
      for (const [symbol, token] of Object.entries(SUPPORTED_TOKENS)) {
        const price = data[token.coingeckoId]?.usd || 1;
        prices[symbol as TokenSymbol] = price;
        
        // Cache individual prices
        this.cache.set(token.coingeckoId, { price, timestamp: Date.now() });
      }
      
      return prices;
    } catch (error) {
      console.error('Error fetching all prices:', error);
      
      // Return fallback prices
      return {
        USDT: 1.0,
        ETH: 3000,
        BNB: 300,
        MATIC: 0.8,
        BASE: 3000,
        ARB: 3000,
      };
    }
  }

  /**
   * Calculate how many tokens to pay for a given amount of MemeChain tokens
   */
  calculatePaymentAmount(
    memeChainAmount: number,
    paymentToken: TokenSymbol,
    paymentTokenPrice: number
  ): number {
    const totalUSD = memeChainAmount * MEMECHAIN_TOKEN.price;
    const paymentAmount = totalUSD / paymentTokenPrice;
    
    return paymentAmount;
  }

  /**
   * Calculate how many MemeChain tokens can be bought with a given payment amount
   */
  calculateMemeChainAmount(
    paymentAmount: number,
    paymentToken: TokenSymbol,
    paymentTokenPrice: number
  ): number {
    const totalUSD = paymentAmount * paymentTokenPrice;
    const memeChainAmount = totalUSD / MEMECHAIN_TOKEN.price;
    
    return memeChainAmount;
  }

  /**
   * Format token amount with proper decimals
   */
  formatTokenAmount(amount: number, token: TokenSymbol): string {
    const tokenConfig = SUPPORTED_TOKENS[token];
    const formatted = amount.toFixed(tokenConfig.decimals === 18 ? 6 : 2);
    return formatted;
  }
}

// Export singleton instance
export const priceService = new PriceService();
