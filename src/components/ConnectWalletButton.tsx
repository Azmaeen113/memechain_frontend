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
  useCustomUI = true 
}: ConnectWalletButtonProps) {
  const { address, isConnected, chain, connector } = useAccount();
  const { data: balance } = useBalance({
    address,
  });
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  
  // User context
  const { userData, isLoading: userLoading, error: userError, isNewUser } = useUser();
  
  // RainbowKit modal hooks
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  
  // State for connection status
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Check if wallet is available
  const [isWalletAvailable, setIsWalletAvailable] = useState(false);
  
  useEffect(() => {
    // Check if MetaMask or other wallets are available
    const checkWalletAvailability = () => {
      if (typeof window !== 'undefined') {
        const hasMetaMask = !!(window as any).ethereum;
        const hasWalletConnect = !!(window as any).walletconnect;
        setIsWalletAvailable(hasMetaMask || hasWalletConnect);
      }
    };
    
    checkWalletAvailability();
    
    // Listen for wallet connection events
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        disconnect();
      }
    };
    
    const handleChainChanged = (chainId: string) => {
      // Chain was changed
      window.location.reload();
    };
    
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
      (window as any).ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
        (window as any).ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [disconnect]);

  /**
   * Enhanced wallet connection with error handling
   */
  const handleConnect = async () => {
    if (!isWalletAvailable) {
      toast.error('No wallet detected. Please install MetaMask or another supported wallet.');
      return;
    }
    
    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      openConnectModal();
    } catch (error) {
      console.error('Connection error:', error);
      setConnectionError('Failed to connect wallet. Please try again.');
      toast.error('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  /**
   * Copy wallet address to clipboard
   */
  const copyAddress = async () => {
    if (!address) return;
    
    try {
      await navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy address');
    }
  };

  /**
   * Open blockchain explorer for the connected address
   */
  const openExplorer = () => {
    if (!address || !chain) return;
    
    const explorerUrls = {
      1: `https://etherscan.io/address/${address}`, // Ethereum
      137: `https://polygonscan.com/address/${address}`, // Polygon
      56: `https://bscscan.com/address/${address}`, // BSC
      42161: `https://arbiscan.io/address/${address}`, // Arbitrum
      8453: `https://basescan.org/address/${address}`, // Base
    };
    
    const explorerUrl = explorerUrls[chain.id as keyof typeof explorerUrls];
    if (explorerUrl) {
      window.open(explorerUrl, '_blank');
    }
  };

  /**
   * Format balance for display
   */
  const formatBalance = () => {
    if (!balance) return '0.00';
    return parseFloat(formatEther(balance.value)).toFixed(4);
  };

  /**
   * Get chain display name
   */
  const getChainName = () => {
    if (!chain) return 'Unknown';
    return chain.name;
  };

  /**
   * Truncate address for display
   */
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // If not using custom UI, return RainbowKit's default ConnectButton
  if (!useCustomUI) {
    return <ConnectButton />;
  }

  // Custom UI implementation
  if (!isConnected || !address) {
    // Not connected state
    return (
      <div className="space-y-2">
        <Button
          onClick={handleConnect}
          disabled={isConnecting || !isWalletAvailable}
          size={size}
          className={`bg-primary text-primary-foreground hover:bg-primary/90 glow-primary ${className}`}
        >
          {isConnecting ? (
            <>
              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4 mr-2" />
              {!isWalletAvailable ? 'Install Wallet' : 'Connect Wallet'}
            </>
          )}
        </Button>
        
        {connectionError && (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertCircle className="w-4 h-4" />
            {connectionError}
          </div>
        )}
        
        {!isWalletAvailable && (
          <div className="text-xs text-muted-foreground">
            <p>No wallet detected. Please install MetaMask or another supported wallet.</p>
            <a 
              href="https://metamask.io/download/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Download MetaMask →
            </a>
          </div>
        )}
      </div>
    );
  }

  // Connected state - show account info and actions
  if (variant === 'nav') {
    // Navigation bar variant - compact display
    return (
      <div className="flex items-center gap-2">
        <QuickChainSwitcher />
        <Badge variant="secondary" className="text-xs">
          {getChainName()}
        </Badge>
        <Button
          onClick={openAccountModal}
          variant="outline"
          size="sm"
          className={`hover:bg-muted ${className}`}
        >
          <Wallet className="w-4 h-4 mr-2" />
          {truncateAddress(address)}
        </Button>
      </div>
    );
  }

  if (variant === 'presale') {
    // Presale page variant - detailed display
    return (
      <div className="space-y-4">
        {/* Connection Status */}
        <div className="p-4 bg-muted rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Connected Wallet</p>
                  {isNewUser && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      <Crown className="h-3 w-3 mr-1" />
                      New User
                    </Badge>
                  )}
                  {userData?.paid && (
                    <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
                      <User className="h-3 w-3 mr-1" />
                      Paid
                    </Badge>
                  )}
                </div>
                <p className="font-mono text-sm font-semibold">
                  {truncateAddress(address)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant={chainId === 1 ? "default" : "secondary"} 
                    className="text-xs"
                  >
                    {getChainName()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatBalance()} {chain?.nativeCurrency?.symbol || 'ETH'}
                  </span>
                </div>
                {connector && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Connected via {connector.name}
                  </p>
                )}
                {userLoading && (
                  <p className="text-xs text-blue-600 mt-1">
                    Loading user data...
                  </p>
                )}
                {userError && (
                  <p className="text-xs text-red-600 mt-1">
                    Error: {userError}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyAddress}
                className="hover:bg-muted"
                title="Copy address"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={openExplorer}
                className="hover:bg-muted"
                title="View on explorer"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => disconnect()}
                className="hover:bg-muted"
                title="Disconnect wallet"
              >
                <Power className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* User Information */}
        {userData && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="h-5 w-5" />
              User Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Member Since</p>
                <p className="text-sm text-gray-600">
                  {new Date(userData.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Payment Status</p>
                <div className="flex items-center gap-2">
                  <Badge variant={userData.paid ? "default" : "secondary"}>
                    {userData.paid ? "✅ Paid" : "⏳ Pending"}
                  </Badge>
                </div>
              </div>
              {userData.col1 && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Additional Info</p>
                  <p className="text-sm text-gray-600">{userData.col1}</p>
                </div>
              )}
              {userData.col2 && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Connection Data</p>
                  <p className="text-sm text-gray-600">{userData.col2}</p>
                </div>
              )}
            </div>
            {isNewUser && (
              <div className="mt-3 p-3 bg-green-100 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  🎉 Welcome to MemeChain! You're now registered for the presale.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Chain Switcher */}
        <div className="space-y-2">
          <div className="text-center">
            <QuickChainSwitcher />
          </div>
          
          {/* Supported Networks Info */}
          <div className="text-xs text-muted-foreground text-center">
            <p>Supported networks: Ethereum, Polygon, BSC, Arbitrum, Base, Optimism, Avalanche, Fantom, Gnosis, zkSync, Linea, Scroll, Mantle, Blast</p>
            {chainId !== 1 && (
              <p className="text-yellow-600 mt-1">
                ⚠️ Recommended: Switch to Ethereum Mainnet for presale
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-sm font-semibold">{truncateAddress(address)}</p>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {getChainName()}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatBalance()} {chain?.nativeCurrency?.symbol || 'ETH'}
          </span>
        </div>
      </div>
      <Button
        onClick={openAccountModal}
        variant="outline"
        size={size}
        className={`hover:bg-muted ${className}`}
      >
        <Wallet className="w-4 h-4" />
      </Button>
    </div>
  );
}

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
