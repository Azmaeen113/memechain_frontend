/**
 * Environment variables configuration
 * Note: For Vite, environment variables must be prefixed with VITE_
 */

export const env = {
  // WalletConnect Project ID - Get from https://cloud.walletconnect.com/
  walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  
  // Default Chain ID (1 = Ethereum Mainnet)
  defaultChainId: Number(import.meta.env.VITE_CHAIN_ID) || 1,
  
  // App configuration
  appName: 'MemeChain Presale',
  appDescription: 'Secure your MEME tokens at discounted prices',
} as const;

/**
 * Validate environment variables
 */
export function validateEnv() {
  if (env.walletConnectProjectId === 'demo-project-id') {
    console.warn(
      '⚠️  Using demo WalletConnect Project ID. Please set VITE_WALLETCONNECT_PROJECT_ID in your .env.local file for production use.'
    );
  }
  
  return {
    isValid: true,
    warnings: env.walletConnectProjectId === 'demo-project-id' ? ['Missing WalletConnect Project ID'] : [],
  };
}
