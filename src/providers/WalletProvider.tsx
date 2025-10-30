import React, { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/config/wagmi';
import { validateEnv } from '@/config/env';
import { UserProvider } from '@/contexts/UserContext';

// Import RainbowKit styles
import '@rainbow-me/rainbowkit/styles.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Web3Provider - Wraps the app with necessary Web3 providers
 * Includes RainbowKit, Wagmi, React Query, and User providers
 */
export function WalletProvider({ children }: { children: ReactNode }) {
  // Validate environment variables on app start
  React.useEffect(() => {
    const validation = validateEnv();
    if (validation.warnings.length > 0) {
      validation.warnings.forEach(warning => console.warn(warning));
    }
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={{
            lightMode: lightTheme({
              accentColor: '#8b5cf6', // Purple accent matching the app theme
              accentColorForeground: 'white',
              borderRadius: 'medium',
            }),
            darkMode: darkTheme({
              accentColor: '#8b5cf6', // Purple accent matching the app theme
              accentColorForeground: 'white',
              borderRadius: 'medium',
            }),
          }}
          appInfo={{
            appName: 'MemeChain Presale',
            learnMoreUrl: 'https://memechain.com',
          }}
          initialChain={config.chains[0]} // Default to first chain (Ethereum)
        >
          <UserProvider>
            {children}
          </UserProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
