import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  Power, 
  AlertCircle, 
  CheckCircle,
  RefreshCw,
  Info,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface SolanaWalletInfo {
  publicKey: string;
  connected: boolean;
  balance?: number;
}

/**
 * SolanaWalletConnector - Handles Solana wallet connections
 * Note: This requires @solana/web3.js and @solana/wallet-adapter packages
 * Install with: npm install @solana/web3.js @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets
 */
export function SolanaWalletConnector() {
  const [walletInfo, setWalletInfo] = useState<SolanaWalletInfo>({
    publicKey: '',
    connected: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSolanaAvailable, setIsSolanaAvailable] = useState(false);

  useEffect(() => {
    // Check if Solana wallet is available
    const checkSolanaAvailability = () => {
      const hasPhantom = !!(window as any).solana?.isPhantom;
      const hasSolflare = !!(window as any).solflare;
      const hasBackpack = !!(window as any).backpack;
      
      setIsSolanaAvailable(hasPhantom || hasSolflare || hasBackpack);
      
      if (hasPhantom || hasSolflare || hasBackpack) {
        // Check if already connected
        const wallet = (window as any).solana || (window as any).solflare || (window as any).backpack;
        if (wallet && wallet.isConnected) {
          setWalletInfo({
            publicKey: wallet.publicKey?.toString() || '',
            connected: true,
          });
        }
      }
    };

    checkSolanaAvailability();
  }, []);

  const connectSolanaWallet = async () => {
    if (!isSolanaAvailable) {
      toast.error('No Solana wallet detected. Please install Phantom, Solflare, or Backpack wallet.');
      return;
    }

    setIsLoading(true);
    try {
      const wallet = (window as any).solana || (window as any).solflare || (window as any).backpack;
      
      if (!wallet) {
        throw new Error('No Solana wallet found');
      }

      const response = await wallet.connect();
      
      setWalletInfo({
        publicKey: response.publicKey.toString(),
        connected: true,
      });
      
      toast.success('Connected to Solana wallet!');
    } catch (error: any) {
      console.error('Solana connection error:', error);
      toast.error('Failed to connect Solana wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectSolanaWallet = async () => {
    try {
      const wallet = (window as any).solana || (window as any).solflare || (window as any).backpack;
      
      if (wallet && wallet.disconnect) {
        await wallet.disconnect();
      }
      
      setWalletInfo({
        publicKey: '',
        connected: false,
      });
      
      toast.success('Disconnected from Solana wallet');
    } catch (error) {
      console.error('Solana disconnection error:', error);
      toast.error('Failed to disconnect Solana wallet');
    }
  };

  const copyAddress = async () => {
    if (!walletInfo.publicKey) return;
    
    try {
      await navigator.clipboard.writeText(walletInfo.publicKey);
      toast.success('Solana address copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy address');
    }
  };

  const openExplorer = () => {
    if (!walletInfo.publicKey) return;
    
    const explorerUrl = `https://solscan.io/account/${walletInfo.publicKey}`;
    window.open(explorerUrl, '_blank');
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-purple-500" />
          Solana Wallet
        </CardTitle>
        <CardDescription>
          Connect to Solana blockchain using Phantom, Solflare, or Backpack
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          {walletInfo.connected ? (
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
              <p className="font-medium">Solana Wallet Detection:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Phantom: {(window as any).solana?.isPhantom ? '✅' : '❌'}</div>
                <div>Solflare: {(window as any).solflare ? '✅' : '❌'}</div>
                <div>Backpack: {(window as any).backpack ? '✅' : '❌'}</div>
                <div>Available: {isSolanaAvailable ? '✅' : '❌'}</div>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Connection Actions */}
        <div className="flex gap-2 flex-wrap">
          {!walletInfo.connected ? (
            <Button 
              onClick={connectSolanaWallet} 
              disabled={!isSolanaAvailable || isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Solana Wallet
                </>
              )}
            </Button>
          ) : (
            <Button onClick={disconnectSolanaWallet} variant="destructive">
              <Power className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          )}
        </div>

        {/* Wallet Details */}
        {walletInfo.connected && walletInfo.publicKey && (
          <div className="space-y-3">
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Solana Address</span>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={copyAddress}>
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={openExplorer}>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <p className="font-mono text-sm break-all">{walletInfo.publicKey}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Truncated: {truncateAddress(walletInfo.publicKey)}
              </p>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Network</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="default" className="bg-purple-600">
                  Solana Mainnet
                </Badge>
                <span className="text-xs text-muted-foreground">
                  RPC: https://api.mainnet-beta.solana.com
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Installation Instructions */}
        {!isSolanaAvailable && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">No Solana wallet detected</p>
                <p className="text-sm">Install one of these wallets:</p>
                <div className="flex gap-2 flex-wrap">
                  <a 
                    href="https://phantom.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline text-sm"
                  >
                    Phantom →
                  </a>
                  <a 
                    href="https://solflare.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline text-sm"
                  >
                    Solflare →
                  </a>
                  <a 
                    href="https://backpack.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline text-sm"
                  >
                    Backpack →
                  </a>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Multi-Chain Wallet Connector - Combines EVM and Solana wallets
 */
export function MultiChainWalletConnector() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Multi-Chain Wallet Connection</h2>
        <p className="text-muted-foreground">
          Connect to multiple blockchain networks
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* EVM Chains */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-500" />
              EVM Chains
            </CardTitle>
            <CardDescription>
              Ethereum, Polygon, BSC, Arbitrum, Base, and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Use MetaMask, WalletConnect, or other EVM-compatible wallets
            </p>
            <Button className="w-full">
              <Wallet className="h-4 w-4 mr-2" />
              Connect EVM Wallet
            </Button>
          </CardContent>
        </Card>

        {/* Solana */}
        <SolanaWalletConnector />
      </div>
    </div>
  );
}

