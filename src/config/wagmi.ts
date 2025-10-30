import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { 
  mainnet, 
  polygon, 
  bsc, 
  arbitrum, 
  base, 
  sepolia,
  optimism,
  avalanche,
  fantom,
  gnosis,
  zkSync,
  linea,
  scroll,
  mantle,
  blast
} from 'wagmi/chains';

/**
 * Wagmi and RainbowKit configuration
 * Supports multiple high-ranking blockchain networks
 */
export const config = getDefaultConfig({
  appName: 'MemeChain Presale',
  projectId: '32f69a4af876e8f694e3bb99749029c3', // Your provided project ID
  chains: [
    mainnet,      // Ethereum Mainnet
    polygon,      // Polygon
    bsc,          // Binance Smart Chain
    arbitrum,     // Arbitrum One
    base,         // Base
    optimism,     // Optimism
    avalanche,    // Avalanche C-Chain
    fantom,       // Fantom Opera
    gnosis,       // Gnosis Chain
    zkSync,       // zkSync Era
    linea,        // Linea
    scroll,       // Scroll
    mantle,       // Mantle
    blast,        // Blast
    sepolia       // Ethereum Sepolia (for testing)
  ],
  ssr: false, // Disabled for Vite/React Router setup
});

/**
 * Supported chains configuration with detailed information
 */
export const supportedChains = {
  mainnet: {
    id: mainnet.id,
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: mainnet.rpcUrls.default.http[0],
    explorer: 'https://etherscan.io',
    priority: 1, // Highest priority
  },
  polygon: {
    id: polygon.id,
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: polygon.rpcUrls.default.http[0],
    explorer: 'https://polygonscan.com',
    priority: 2,
  },
  bsc: {
    id: bsc.id,
    name: 'BSC',
    symbol: 'BNB',
    rpcUrl: bsc.rpcUrls.default.http[0],
    explorer: 'https://bscscan.com',
    priority: 3,
  },
  arbitrum: {
    id: arbitrum.id,
    name: 'Arbitrum',
    symbol: 'ETH',
    rpcUrl: arbitrum.rpcUrls.default.http[0],
    explorer: 'https://arbiscan.io',
    priority: 4,
  },
  base: {
    id: base.id,
    name: 'Base',
    symbol: 'ETH',
    rpcUrl: base.rpcUrls.default.http[0],
    explorer: 'https://basescan.org',
    priority: 5,
  },
  optimism: {
    id: optimism.id,
    name: 'Optimism',
    symbol: 'ETH',
    rpcUrl: optimism.rpcUrls.default.http[0],
    explorer: 'https://optimistic.etherscan.io',
    priority: 6,
  },
  avalanche: {
    id: avalanche.id,
    name: 'Avalanche',
    symbol: 'AVAX',
    rpcUrl: avalanche.rpcUrls.default.http[0],
    explorer: 'https://snowtrace.io',
    priority: 7,
  },
  fantom: {
    id: fantom.id,
    name: 'Fantom',
    symbol: 'FTM',
    rpcUrl: fantom.rpcUrls.default.http[0],
    explorer: 'https://ftmscan.com',
    priority: 8,
  },
  gnosis: {
    id: gnosis.id,
    name: 'Gnosis',
    symbol: 'GNO',
    rpcUrl: gnosis.rpcUrls.default.http[0],
    explorer: 'https://gnosisscan.io',
    priority: 9,
  },
  zkSync: {
    id: zkSync.id,
    name: 'zkSync Era',
    symbol: 'ETH',
    rpcUrl: zkSync.rpcUrls.default.http[0],
    explorer: 'https://explorer.zksync.io',
    priority: 10,
  },
  linea: {
    id: linea.id,
    name: 'Linea',
    symbol: 'ETH',
    rpcUrl: linea.rpcUrls.default.http[0],
    explorer: 'https://lineascan.build',
    priority: 11,
  },
  scroll: {
    id: scroll.id,
    name: 'Scroll',
    symbol: 'ETH',
    rpcUrl: scroll.rpcUrls.default.http[0],
    explorer: 'https://scrollscan.com',
    priority: 12,
  },
  mantle: {
    id: mantle.id,
    name: 'Mantle',
    symbol: 'MNT',
    rpcUrl: mantle.rpcUrls.default.http[0],
    explorer: 'https://mantlescan.info',
    priority: 13,
  },
  blast: {
    id: blast.id,
    name: 'Blast',
    symbol: 'ETH',
    rpcUrl: blast.rpcUrls.default.http[0],
    explorer: 'https://blastscan.io',
    priority: 14,
  },
  sepolia: {
    id: sepolia.id,
    name: 'Sepolia',
    symbol: 'ETH',
    rpcUrl: sepolia.rpcUrls.default.http[0],
    explorer: 'https://sepolia.etherscan.io',
    priority: 99, // Testnet - lowest priority
  },
};

/**
 * Get chains sorted by priority (highest first)
 */
export const getChainsByPriority = () => {
  return Object.values(supportedChains).sort((a, b) => a.priority - b.priority);
};

/**
 * Get top-tier chains (priority 1-5)
 */
export const getTopTierChains = () => {
  return Object.values(supportedChains).filter(chain => chain.priority <= 5);
};

/**
 * Default chain configuration
 */
export const defaultChain = supportedChains.mainnet;
