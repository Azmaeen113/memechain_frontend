import React, { useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { 
  Network, 
  ChevronDown, 
  Check, 
  ExternalLink,
  Zap,
  TrendingUp,
  Star
} from 'lucide-react';
import { toast } from 'sonner';
import { supportedChains, getChainsByPriority, getTopTierChains } from '@/config/wagmi';

interface ChainSwitcherProps {
  variant?: 'default' | 'compact' | 'detailed';
  showTopTierOnly?: boolean;
  className?: string;
}

/**
 * ChainSwitcher - Comprehensive chain switching component
 * Supports all major EVM-compatible chains with priority-based organization
 */
export function ChainSwitcher({ 
  variant = 'default',
  showTopTierOnly = false,
  className = ''
}: ChainSwitcherProps) {
  const { chain, chainId } = useAccount();
  const { switchChain, isPending } = useSwitchChain();
  
  const [isOpen, setIsOpen] = useState(false);
  
  const availableChains = showTopTierOnly ? getTopTierChains() : getChainsByPriority();
  const currentChain = availableChains.find(c => c.id === chainId);
  
  const handleChainSwitch = async (targetChainId: number) => {
    if (targetChainId === chainId) {
      toast.info('Already connected to this network');
      return;
    }
    
    try {
      await switchChain({ chainId: targetChainId });
      toast.success(`Switched to ${availableChains.find(c => c.id === targetChainId)?.name}`);
      setIsOpen(false);
    } catch (error: any) {
      console.error('Chain switch error:', error);
      
      if (error.code === 4902) {
        toast.error('Please add this network to your wallet first');
      } else if (error.code === 4001) {
        toast.error('User rejected the network switch');
      } else {
        toast.error('Failed to switch network. Please try manually.');
      }
    }
  };
  
  const getChainIcon = (chainName: string) => {
    const icons: { [key: string]: string } = {
      'Ethereum': '🔷',
      'Polygon': '🟣',
      'BSC': '🟡',
      'Arbitrum': '🔵',
      'Base': '🔵',
      'Optimism': '🔴',
      'Avalanche': '🔴',
      'Fantom': '🔵',
      'Gnosis': '🟢',
      'zkSync Era': '⚡',
      'Linea': '🔵',
      'Scroll': '🟦',
      'Mantle': '🟤',
      'Blast': '💥',
      'Sepolia': '🧪',
    };
    return icons[chainName] || '⛓️';
  };
  
  const getPriorityBadge = (priority: number) => {
    if (priority <= 3) return <Star className="h-3 w-3 text-yellow-500" />;
    if (priority <= 5) return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (priority <= 10) return <Zap className="h-3 w-3 text-blue-500" />;
    return null;
  };
  
  if (variant === 'compact') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={`hover:bg-muted ${className}`}
            disabled={isPending}
          >
            <Network className="h-4 w-4 mr-2" />
            {currentChain?.name || 'Select Network'}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Switch Network</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {availableChains.map((chainOption) => (
            <DropdownMenuItem
              key={chainOption.id}
              onClick={() => handleChainSwitch(chainOption.id)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{getChainIcon(chainOption.name)}</span>
                <span className="font-medium">{chainOption.name}</span>
                {getPriorityBadge(chainOption.priority)}
              </div>
              {chainOption.id === chainId && (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  if (variant === 'detailed') {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Network Selection
          </CardTitle>
          <CardDescription>
            Choose your preferred blockchain network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableChains.map((chainOption) => (
              <Card
                key={chainOption.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  chainOption.id === chainId 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => handleChainSwitch(chainOption.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getChainIcon(chainOption.name)}</span>
                      <div>
                        <h3 className="font-semibold">{chainOption.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {chainOption.symbol}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {getPriorityBadge(chainOption.priority)}
                      {chainOption.id === chainId && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Chain ID: {chainOption.id}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(chainOption.explorer, '_blank');
                      }}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Default variant
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Switch Network</h3>
        <Badge variant={currentChain?.priority <= 5 ? "default" : "secondary"}>
          {currentChain?.name || 'Unknown'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {availableChains.map((chainOption) => (
          <Button
            key={chainOption.id}
            variant={chainOption.id === chainId ? "default" : "outline"}
            size="sm"
            onClick={() => handleChainSwitch(chainOption.id)}
            disabled={isPending}
            className="flex items-center gap-2 justify-start"
          >
            <span className="text-lg">{getChainIcon(chainOption.name)}</span>
            <span className="truncate">{chainOption.name}</span>
            {getPriorityBadge(chainOption.priority)}
          </Button>
        ))}
      </div>
      
      {isPending && (
        <div className="text-center text-sm text-muted-foreground">
          Switching network...
        </div>
      )}
    </div>
  );
}

/**
 * Quick chain switcher for navigation bars
 */
export function QuickChainSwitcher({ className = '' }: { className?: string }) {
  return <ChainSwitcher variant="compact" showTopTierOnly={true} className={className} />;
}

/**
 * Full-featured chain switcher for settings pages
 */
export function FullChainSwitcher({ className = '' }: { className?: string }) {
  return <ChainSwitcher variant="detailed" className={className} />;
}

