import React, { useState, useEffect } from 'react';
import { useAccount, useBalance, useSendTransaction, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Coins, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  RefreshCw,
  ExternalLink,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { SUPPORTED_TOKENS, MEMECHAIN_TOKEN, TokenSymbol, priceService } from '@/lib/priceService';
import { useTokenPrices } from '@/hooks/useTokenPrices';
import { useUser, useUserActions } from '@/contexts/UserContext';

// Payment wallet address
const PAYMENT_WALLET = '0x60E62abFceeC2AC5bb7bC2E68a7c1263da65bfa7';

interface BuySectionProps {
  className?: string;
}

export function BuySection({ className = '' }: BuySectionProps) {
  const { address, chain } = useAccount();
  const { data: balance } = useBalance({ address });
  const { userData } = useUser();
  const { markAsPaid } = useUserActions();
  
  // Price data
  const { prices, loading: pricesLoading, error: pricesError } = useTokenPrices();
  
  // State
  const [memeChainAmount, setMemeChainAmount] = useState<string>('100');
  const [paymentToken, setPaymentToken] = useState<TokenSymbol>('USDT');
  const [paymentAmount, setPaymentAmount] = useState<string>('0');
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Transaction state
  const { sendTransaction, data: hash, error: sendError, isPending } = useSendTransaction();
  const { writeContract, data: contractHash, error: contractError, isPending: isContractPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: hash || contractHash,
  });

  // Calculate payment amount when inputs change
  useEffect(() => {
    const calculatePayment = async () => {
      if (!memeChainAmount || !paymentToken || !prices[paymentToken]) return;
      
      setIsCalculating(true);
      
      try {
        const amount = parseFloat(memeChainAmount);
        if (isNaN(amount) || amount <= 0) {
          setPaymentAmount('0');
          return;
        }
        
        const calculatedAmount = priceService.calculatePaymentAmount(
          amount,
          paymentToken,
          prices[paymentToken]
        );
        
        const formattedAmount = priceService.formatTokenAmount(calculatedAmount, paymentToken);
        setPaymentAmount(formattedAmount);
      } catch (error) {
        console.error('Error calculating payment:', error);
        setPaymentAmount('0');
      } finally {
        setIsCalculating(false);
      }
    };
    
    calculatePayment();
  }, [memeChainAmount, paymentToken, prices]);

  // Handle successful transaction
  useEffect(() => {
    if (isConfirmed && (hash || contractHash)) {
      handleTransactionSuccess();
    }
  }, [isConfirmed, hash, contractHash]);

  const handleTransactionSuccess = async () => {
    try {
      // Call backend /paid endpoint
      const response = await fetch('http://localhost:5000/api/paid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletid: address,
          amount: parseFloat(memeChainAmount),
          transactionHash: hash || contractHash,
          paymentToken: paymentToken,
          paymentAmount: parseFloat(paymentAmount)
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update user data
          await markAsPaid({
            transactionHash: hash || contractHash,
            amount: `${memeChainAmount} ${MEMECHAIN_TOKEN.symbol}`,
            paymentToken: paymentToken,
            paymentAmount: paymentAmount
          });
          
          toast.success(`Successfully purchased ${memeChainAmount} ${MEMECHAIN_TOKEN.symbol} tokens!`);
          
          // Reset form
          setMemeChainAmount('100');
          setPaymentAmount('0');
        } else {
          throw new Error(data.error || 'Failed to update payment status');
        }
      } else {
        throw new Error('Failed to update payment status');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Transaction successful but failed to update payment status. Please contact support.');
    }
  };

  const handleBuy = async () => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!memeChainAmount || parseFloat(memeChainAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast.error('Invalid payment amount');
      return;
    }

    try {
      const tokenConfig = SUPPORTED_TOKENS[paymentToken];
      const tokenAddress = tokenConfig.chains[chain?.id as keyof typeof tokenConfig.chains];
      
      if (!tokenAddress) {
        toast.error(`${paymentToken} is not supported on ${chain?.name}`);
        return;
      }

      const amount = parseEther(paymentAmount);
      
      if (tokenAddress === '0x0000000000000000000000000000000000000000') {
        // Native token (ETH, BNB, MATIC) - Send direct ETH transfer
        sendTransaction({
          to: PAYMENT_WALLET as `0x${string}`,
          value: amount,
        });
      } else {
        // ERC20 token - Use transfer function
        writeContract({
          address: tokenAddress as `0x${string}`,
          abi: [{
            name: 'transfer',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'to', type: 'address' },
              { name: 'amount', type: 'uint256' }
            ],
            outputs: [{ name: '', type: 'bool' }]
          }],
          functionName: 'transfer',
          args: [PAYMENT_WALLET as `0x${string}`, amount],
        });
      }
    } catch (error) {
      console.error('Error initiating transaction:', error);
      toast.error('Failed to initiate transaction');
    }
  };

  const getAvailableTokens = (): TokenSymbol[] => {
    if (!chain) return ['USDT'];
    
    const availableTokens: TokenSymbol[] = [];
    
    for (const [symbol, token] of Object.entries(SUPPORTED_TOKENS)) {
      if (token.chains[chain.id as keyof typeof token.chains]) {
        availableTokens.push(symbol as TokenSymbol);
      }
    }
    
    return availableTokens;
  };

  const getTokenBalance = (token: TokenSymbol): string => {
    if (token === 'ETH' && chain?.id === 1) {
      return balance ? formatEther(balance.value) : '0';
    }
    // For other tokens, you would need to fetch ERC20 balances
    return '0';
  };

  const isTransactionPending = isPending || isContractPending || isConfirming;
  const canBuy = address && !isTransactionPending && parseFloat(memeChainAmount) > 0 && parseFloat(paymentAmount) > 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <ShoppingCart className="h-8 w-8 text-primary" />
          Buy MemeChain Tokens
        </h2>
        <p className="text-muted-foreground">
          Purchase {MEMECHAIN_TOKEN.symbol} tokens at ${MEMECHAIN_TOKEN.price} per token
        </p>
      </div>

      {/* Price Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Live Token Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pricesLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading prices...</span>
            </div>
          ) : pricesError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Error loading prices: {pricesError}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(SUPPORTED_TOKENS).map(([symbol, token]) => (
                <div key={symbol} className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl mb-1">{token.icon}</div>
                  <div className="font-semibold">{symbol}</div>
                  <div className="text-sm text-muted-foreground">
                    ${prices[symbol as TokenSymbol]?.toFixed(2) || '0.00'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Buy Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Purchase Tokens
          </CardTitle>
          <CardDescription>
            Select the amount of {MEMECHAIN_TOKEN.symbol} tokens you want to buy and choose your payment method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* MemeChain Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="memeChainAmount">Amount of {MEMECHAIN_TOKEN.symbol} Tokens</Label>
            <div className="relative">
              <Input
                id="memeChainAmount"
                type="number"
                value={memeChainAmount}
                onChange={(e) => setMemeChainAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                step="1"
                disabled={isTransactionPending}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                {MEMECHAIN_TOKEN.icon}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Total Value: ${(parseFloat(memeChainAmount || '0') * MEMECHAIN_TOKEN.price).toFixed(2)} USD
            </p>
          </div>

          <Separator />

          {/* Payment Token Selection */}
          <div className="space-y-2">
            <Label htmlFor="paymentToken">Pay With</Label>
            <Select
              value={paymentToken}
              onValueChange={(value) => setPaymentToken(value as TokenSymbol)}
              disabled={isTransactionPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment token" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableTokens().map((token) => (
                  <SelectItem key={token} value={token}>
                    <div className="flex items-center gap-2">
                      <span>{SUPPORTED_TOKENS[token].icon}</span>
                      <span>{SUPPORTED_TOKENS[token].symbol}</span>
                      <span className="text-muted-foreground">
                        (${prices[token]?.toFixed(2) || '0.00'})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Amount Display */}
          <div className="space-y-2">
            <Label>Payment Amount</Label>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{SUPPORTED_TOKENS[paymentToken].icon}</span>
                  <div>
                    <div className="font-semibold text-lg">
                      {isCalculating ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Calculating...
                        </div>
                      ) : (
                        `${paymentAmount} ${SUPPORTED_TOKENS[paymentToken].symbol}`
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ${(parseFloat(paymentAmount || '0') * (prices[paymentToken] || 0)).toFixed(2)} USD
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const amount = parseFloat(memeChainAmount || '0');
                    const calculatedAmount = priceService.calculatePaymentAmount(
                      amount,
                      paymentToken,
                      prices[paymentToken] || 1
                    );
                    setPaymentAmount(priceService.formatTokenAmount(calculatedAmount, paymentToken));
                  }}
                  disabled={isCalculating || isTransactionPending}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Transaction Status */}
          {isTransactionPending && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                {isPending || isContractPending ? 'Confirming transaction in your wallet...' : 'Waiting for transaction confirmation...'}
              </AlertDescription>
            </Alert>
          )}

          {(sendError || contractError) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Transaction failed: {(sendError || contractError)?.message || 'Unknown error'}
              </AlertDescription>
            </Alert>
          )}

          {/* Buy Button */}
          <Button
            onClick={handleBuy}
            disabled={!canBuy}
            className="w-full"
            size="lg"
          >
            {isTransactionPending ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Buy {memeChainAmount} {MEMECHAIN_TOKEN.symbol} Tokens
              </>
            )}
          </Button>

          {/* Payment Info */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Payment will be sent to:</p>
            <p className="font-mono text-xs break-all">{PAYMENT_WALLET}</p>
            <p className="mt-2">
              Transaction will be processed on {chain?.name || 'current network'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* User Status */}
      {userData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Your Purchase Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Payment Status</p>
                <Badge variant={userData.paid ? "default" : "secondary"}>
                  {userData.paid ? "✅ Paid" : "⏳ Pending"}
                </Badge>
              </div>
              {userData.paid && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://etherscan.io/address/${address}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Explorer
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
