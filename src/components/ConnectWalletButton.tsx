import React, { useEffect, useState } from 'react';
import { useAccount, useBalance, useDisconnect, useSwitchChain, useChainId } from 'wagmi';
import { ConnectButton, useConnectModal, useAccountModal, useChainModal } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Copy, ExternalLink, Power, AlertCircle, CheckCircle, Network, User, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { formatEther } from 'viem';
import { ChainSwitcher, QuickChainSwitcher } from './ChainSwitcher';
import { supportedChains } from '@/config/wagmi';
import { useUser } from '@/contexts/UserContext';
import { connectWallet as connectWalletApi } from '@/lib/api';

interface ConnectWalletButtonProps {
  /**
   * Button variant - determines the visual style
   */
  variant?: 'default' | 'nav' | 'presale';
  
  /**
   * Button size
   */
  size?: 'default' | 'sm' | 'lg';
  
  /**
   * Custom className for styling
   */
  className?: string;
  
  /**
   * Whether to show the full RainbowKit ConnectButton or custom implementation
   */
  useCustomUI?: boolean;
}

/**
 * ConnectWalletButton - A comprehensive wallet connection component
 * Supports both custom UI and RainbowKit's default ConnectButton
 */
export function ConnectWalletButton({ 
  variant = 'default',
  size = 'default',
  className = '',
  useCustomUI = false 
}: ConnectWalletButtonProps) {
  // Force RainbowKit's ConnectButton only (no install prompts, no custom logic)
  return <ConnectButton />;
}

// The rest of the file (custom UI) is intentionally disabled to ensure
// only RainbowKit's ConnectButton is used for connections for now.

/**
 * Hook for wallet connection state and actions
 * Provides easy access to wallet functionality throughout the app
 */
export function useWalletConnection() {
  const { address, isConnected, chain, connector } = useAccount();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();

  // Check if wallet is available
  const [isWalletAvailable, setIsWalletAvailable] = useState(false);
  
  useEffect(() => {
    const checkWalletAvailability = () => {
      if (typeof window !== 'undefined') {
        const hasMetaMask = !!(window as any).ethereum;
        const hasWalletConnect = !!(window as any).walletconnect;
        setIsWalletAvailable(hasMetaMask || hasWalletConnect);
      }
    };
    
    checkWalletAvailability();
  }, []);

  // Notify backend when wallet connects to record participant
  useEffect(() => {
    const notifyBackend = async () => {
      try {
        if (isConnected && address) {
          await connectWalletApi(address, chain?.name || 'unknown');
        }
      } catch (e) {
        // Non-fatal
        console.warn('Failed to notify backend about wallet connection', e);
      }
    };
    notifyBackend();
  }, [isConnected, address, chain?.name]);

  return {
    // State
    address,
    isConnected,
    chain,
    chainId,
    connector,
    balance: balance ? formatEther(balance.value) : '0',
    isWalletAvailable,
    
    // Actions
    connect: openConnectModal,
    openAccount: openAccountModal,
    switchChain: openChainModal,
    disconnect,
    
    // Utilities
    truncateAddress: (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`,
    formatBalance: () => balance ? parseFloat(formatEther(balance.value)).toFixed(4) : '0.00',
    getChainName: () => chain?.name || 'Unknown',
    isMainnet: chainId === 1,
  };
}
