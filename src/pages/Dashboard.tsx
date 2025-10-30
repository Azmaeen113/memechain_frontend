import { useState, useEffect } from "react";
import { TrendingUp, Users, Coins, Wallet, ExternalLink, Link as LinkIcon, Zap, DollarSign, CheckCircle, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LampDemo } from "@/components/LampDemo";
import { VortexSection } from "@/components/VortexSection";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  // Mock wallet connection for now
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [chain, setChain] = useState<any>({ name: 'ethereum' });
  const [amount, setAmount] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [presaleData, setPresaleData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch presale status
  useEffect(() => {
    fetchPresaleStatus();
  }, []);

  // Fetch user data when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      connectWallet();
    }
  }, [isConnected, address]);

  const fetchPresaleStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('presale-status');
      if (error) throw error;
      if (data.success) {
        setPresaleData(data.data);
      }
    } catch (error: any) {
      console.error('Error fetching presale status:', error);
      toast.error('Failed to load presale data');
    }
  };

  const connectWallet = async () => {
    // Mock wallet connection
    setIsConnected(true);
    setAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");
    setChain({ name: 'ethereum' });
    
    try {
      const { data, error } = await supabase.functions.invoke('connect-wallet', {
        body: {
          walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
          chain: 'ethereum'
        }
      });

      if (error) throw error;
      if (data.success) {
        setUserData(data.data);
        toast.success('Wallet connected successfully!');
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const handlePurchase = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    setLoading(true);

    try {
      // In production, you would actually process the blockchain transaction here
      // For now, we'll simulate it with a mock transaction hash
      const mockTxHash = `0x${Math.random().toString(16).slice(2)}`;

      const { data, error } = await supabase.functions.invoke('presale-purchase', {
        body: {
          walletAddress: address,
          amount: parseFloat(amount),
          chain: chain?.name || 'ethereum',
          txHash: mockTxHash
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success(`Purchase successful! You received ${data.data.memeReceived.toLocaleString()} MEME tokens`);
        setAmount('');
        await connectWallet(); // Refresh user data
        await fetchPresaleStatus(); // Refresh presale stats
      }
    } catch (error: any) {
      console.error('Error processing purchase:', error);
      toast.error('Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTokens = () => {
    if (!amount || parseFloat(amount) <= 0 || !presaleData) return "0";
    return (parseFloat(amount) / presaleData.current_price).toLocaleString();
  };

  const stats = [
    {
      label: "Current Price",
      value: presaleData ? `$${presaleData.current_price}` : "$0.00001",
      icon: TrendingUp
    },
    {
      label: "Total Raised",
      value: presaleData ? `$${presaleData.total_raised.toLocaleString()}` : "$0",
      icon: Coins
    },
    {
      label: "Participants",
      value: presaleData ? presaleData.total_participants.toString() : "0",
      icon: Users
    },
    {
      label: "Your Balance",
      value: userData ? `${userData.memeBalance.toLocaleString()} MEME` : "0 MEME",
      icon: Wallet
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with LampDemo and Vortex Background */}
      <div className="relative h-[60vh] overflow-hidden">
        {/* Vortex Effect - Background only */}
        <div className="absolute inset-0 z-0">
          <VortexSection />
        </div>
        
        {/* LampDemo Content - On top of vortex */}
        <div className="relative z-10 h-full">
          <LampDemo 
            title="MemeChain Presale Dashboard" 
            subtitle="Connect your wallet and participate in the presale"
          />
        </div>
      </div>
      
      <div className="pt-20 md:pt-24">

      {/* Stats */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="p-4 md:p-6 text-center bg-card border-border card-shadow">
                <stat.icon className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-primary" />
                <p className="text-xl md:text-2xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>

          {/* Progress Bar */}
          {presaleData && (
            <Card className="mt-6 p-4 bg-card border-border">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-primary font-semibold">
                  {((presaleData.total_raised / presaleData.hard_cap) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-primary rounded-full animate-pulse-glow" 
                  style={{ width: `${(presaleData.total_raised / presaleData.hard_cap) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-2 text-muted-foreground">
                <span>${presaleData.total_raised.toLocaleString()} raised</span>
                <span>${presaleData.hard_cap.toLocaleString()} goal</span>
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* Main Dashboard Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="p-6 md:p-8 bg-card border-border card-shadow">
              {!isConnected ? (
                <div className="text-center py-8">
                  <Wallet className="h-16 w-16 mx-auto mb-6 text-primary animate-float" />
                  <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
                  <p className="text-muted-foreground mb-6">
                    Connect your wallet to participate in the presale
                  </p>

                  <Button 
                    size="lg" 
                    onClick={connectWallet}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
                  >
                    Connect Wallet
                  </Button>

                  <p className="text-xs text-muted-foreground mt-4">
                    By connecting, you agree to our Terms of Service
                  </p>
                </div>
              ) : (
                <div>
                  {/* Connected Wallet Info */}
                  <div className="flex items-center justify-between mb-6 p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                        <Wallet className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Connected Wallet</p>
                        <p className="font-mono text-sm font-semibold">
                          {address?.slice(0, 6)}...{address?.slice(-4)}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsConnected(false)}>
                      Disconnect
                    </Button>
                  </div>

                  <h2 className="text-2xl font-bold mb-6">Buy MEME Tokens</h2>

                  {/* Amount Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Amount (USD)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Token Calculation */}
                  <div className="mb-6 p-4 bg-primary/10 border border-primary/50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">You will receive:</span>
                      <span className="text-2xl font-bold text-primary">
                        {calculateTokens()} MEME
                      </span>
                    </div>
                  </div>

                  {/* Buy Button */}
                  <Button 
                    size="lg" 
                    onClick={handlePurchase}
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
                  >
                    {loading ? 'Processing...' : 'Buy Now'}
                  </Button>

                  {/* User Stats */}
                  {userData && (
                    <div className="mt-8 pt-8 border-t border-border">
                      <h3 className="font-bold mb-4">Your Contribution</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Contributed:</span>
                          <span className="font-semibold">${userData.totalContributed.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">MEME Allocated:</span>
                          <span className="font-semibold">{userData.memeBalance.toLocaleString()} MEME</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Claim Status:</span>
                          <span className="text-sm text-muted-foreground">After mainnet launch</span>
                        </div>
                      </div>

                      {/* Transaction History */}
                      {userData.transactions && userData.transactions.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-semibold mb-3">Recent Transactions</h4>
                          <div className="space-y-2">
                            {userData.transactions.slice(0, 5).map((tx: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center p-2 bg-muted rounded">
                                <div>
                                  <p className="text-sm font-medium">${tx.amount}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(tx.date).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-primary">
                                    {tx.meme_received.toLocaleString()} MEME
                                  </p>
                                  <a 
                                    href={`#`} 
                                    className="text-xs text-primary flex items-center gap-1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    View Tx <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It <span className="text-gradient">Works</span>
          </h2>

          <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {[
              { step: "1", title: "Connect Wallet", icon: LinkIcon },
              { step: "2", title: "Select Chain", icon: LinkIcon },
              { step: "3", title: "Enter Amount", icon: DollarSign },
              { step: "4", title: "Confirm Transaction", icon: CheckCircle },
              { step: "5", title: "Claim After Launch", icon: Rocket },
            ].map((item, index) => (
              <Card key={index} className="p-6 text-center bg-card border-border card-shadow hover:border-primary transition-all">
                <item.icon className="h-12 w-12 mx-auto mb-3 text-primary" />
                <div className="text-sm text-primary font-bold mb-2">Step {item.step}</div>
                <div className="text-sm font-semibold">{item.title}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default Dashboard;
