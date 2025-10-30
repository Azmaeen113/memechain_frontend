import React, { useState, useEffect } from 'react';
import { ConnectWalletButton, useWalletConnection } from './ConnectWalletButton';
import { ChainSwitcher, FullChainSwitcher } from './ChainSwitcher';
import { SolanaWalletConnector, MultiChainWalletConnector } from './SolanaWalletConnector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  Power, 
  AlertCircle, 
  CheckCircle,
  RefreshCw,
  Info,
  Network,
  Zap,
  User,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';

/**
 * Test component to verify wallet connection functionality
 * This can be used for testing and debugging wallet features
 */
export function WalletTest() {
  const {
    isConnected,
    address,
    chain,
    chainId,
    connector,
    balance,
    formatBalance,
    getChainName,
    truncateAddress,
    connect,
    disconnect,
    switchChain,
    isWalletAvailable,
    isMainnet,
  } = useWalletConnection();

  // User context
  const { userData, isLoading: userLoading, error: userError, isNewUser, refreshUserData } = useUser();

  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check wallet availability and get detailed info
  useEffect(() => {
    const checkWalletInfo = () => {
      const info: any = {
        hasEthereum: !!(window as any).ethereum,
        hasMetaMask: !!(window as any).ethereum?.isMetaMask,
        hasWalletConnect: !!(window as any).walletconnect,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      };

      if ((window as any).ethereum) {
        info.ethereum = {
          isMetaMask: (window as any).ethereum.isMetaMask,
          isCoinbaseWallet: (window as any).ethereum.isCoinbaseWallet,
          isRabby: (window as any).ethereum.isRabby,
          selectedAddress: (window as any).ethereum.selectedAddress,
          chainId: (window as any).ethereum.chainId,
          networkVersion: (window as any).ethereum.networkVersion,
        };
      }

      setWalletInfo(info);
    };

    checkWalletInfo();
  }, [isConnected, chainId]);

  const copyAddress = async () => {
    if (!address) return;
    
    try {
      await navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy address');
    }
  };

  const openExplorer = () => {
    if (!address || !chain) return;
    
    const explorerUrls = {
      1: `https://etherscan.io/address/${address}`,
      137: `https://polygonscan.com/address/${address}`,
      56: `https://bscscan.com/address/${address}`,
      42161: `https://arbiscan.io/address/${address}`,
      8453: `https://basescan.org/address/${address}`,
      11155111: `https://sepolia.etherscan.io/address/${address}`,
    };
    
    const explorerUrl = explorerUrls[chain.id as keyof typeof explorerUrls];
    if (explorerUrl) {
      window.open(explorerUrl, '_blank');
    }
  };

  const refreshWalletInfo = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Multi-Chain Wallet Test
          </CardTitle>
          <CardDescription>
            Test and debug wallet connection functionality across multiple blockchains
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="evm" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="evm" className="flex items-center gap-2">
                <Network className="h-4 w-4" />
                EVM Chains
              </TabsTrigger>
              <TabsTrigger value="solana" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Solana
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="evm" className="space-y-4 mt-6">
              {/* EVM Wallet Testing */}
              <div className="space-y-4">
                {/* Connection Status */}
                <div className="flex items-center gap-2">
                  {isConnected ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-green-500 font-medium">Connected</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span className="text-red-500 font-medium">Not Connected</span>
                    </>
                  )}
                </div>

                {/* Wallet Detection Status */}
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">EVM Wallet Detection Status:</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Ethereum Provider: {walletInfo?.hasEthereum ? '✅' : '❌'}</div>
                        <div>MetaMask: {walletInfo?.hasMetaMask ? '✅' : '❌'}</div>
                        <div>WalletConnect: {walletInfo?.hasWalletConnect ? '✅' : '❌'}</div>
                        <div>Wallet Available: {isWalletAvailable ? '✅' : '❌'}</div>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* User Information */}
                {isConnected && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        User Profile
                        {isNewUser && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <Crown className="h-3 w-3 mr-1" />
                            New User
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        User data from backend API
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {userLoading ? (
                        <div className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Loading user data...</span>
                        </div>
                      ) : userError ? (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Error loading user data: {userError}
                          </AlertDescription>
                        </Alert>
                      ) : userData ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">User ID</p>
                            <p className="text-sm text-gray-600">{userData.id}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Wallet Address</p>
                            <p className="text-sm text-gray-600 font-mono">{userData.walletid}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Payment Status</p>
                            <Badge variant={userData.paid ? "default" : "secondary"}>
                              {userData.paid ? "✅ Paid" : "⏳ Pending"}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Member Since</p>
                            <p className="text-sm text-gray-600">
                              {new Date(userData.created_at).toLocaleDateString()}
                            </p>
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
                      ) : (
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            No user data available. User will be created automatically when wallet connects.
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      <div className="flex gap-2">
                        <Button onClick={refreshUserData} variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh User Data
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Connection Actions */}
                <div className="flex gap-2 flex-wrap">
                  {!isConnected ? (
                    <ConnectWalletButton variant="default" />
                  ) : (
                    <>
                      <Button onClick={disconnect} variant="destructive">
                        <Power className="h-4 w-4 mr-2" />
                        Disconnect
                      </Button>
                    </>
                  )}
                  <Button onClick={refreshWalletInfo} variant="outline" disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>

                {/* Chain Switcher */}
                {isConnected && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Network Selection</h3>
                    <ChainSwitcher variant="default" />
                  </div>
                )}

                {/* Wallet Details */}
                {isConnected && address && (
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Wallet Address</span>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={copyAddress}>
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={openExplorer}>
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="font-mono text-sm break-all">{address}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Truncated: {truncateAddress(address)}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 bg-muted rounded-lg">
                        <span className="text-sm font-medium">Network</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={isMainnet ? "default" : "secondary"}>
                            {getChainName()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Chain ID: {chainId}
                          </span>
                        </div>
                        {!isMainnet && (
                          <p className="text-xs text-yellow-600 mt-1">
                            ⚠️ Not on Ethereum Mainnet
                          </p>
                        )}
                      </div>

                      <div className="p-3 bg-muted rounded-lg">
                        <span className="text-sm font-medium">Balance</span>
                        <p className="text-sm mt-1">
                          {formatBalance()} {chain?.nativeCurrency?.symbol || 'ETH'}
                        </p>
                      </div>
                    </div>

                    {connector && (
                      <div className="p-3 bg-muted rounded-lg">
                        <span className="text-sm font-medium">Connector</span>
                        <p className="text-sm mt-1">{connector.name}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Debug Information */}
                <details className="space-y-2">
                  <summary className="cursor-pointer text-sm font-medium">Debug Information</summary>
                  <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                    {JSON.stringify({
                      isConnected,
                      address,
                      chainId,
                      chainName: chain?.name,
                      connector: connector?.name,
                      balance: formatBalance(),
                      isWalletAvailable,
                      isMainnet,
                      walletInfo,
                    }, null, 2)}
                  </pre>
                </details>
              </div>
            </TabsContent>
            
            <TabsContent value="solana" className="mt-6">
              <SolanaWalletConnector />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
