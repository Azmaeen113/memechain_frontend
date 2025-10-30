import { useState, useEffect } from "react";
import { Wallet, TrendingUp, Users, Coins, ExternalLink, Link as LinkIcon, Zap, DollarSign, CheckCircle, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LampDemo } from "@/components/LampDemo";
import { VortexSection } from "@/components/VortexSection";
import { ConnectWalletButton, useWalletConnection } from "@/components/ConnectWalletButton";
import { BuySection } from "@/components/BuySection";
import { toast } from "sonner";
import { getPresaleStatus, connectWallet, processPurchase, getUserData, getLiveStats } from "@/lib/api";

const Presale = () => {
  const [amount, setAmount] = useState("");
  const [selectedChain, setSelectedChain] = useState("ethereum");
  const [presaleData, setPresaleData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [liveStats, setLiveStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);
  
  // Use the wallet connection hook
  const { 
    isConnected, 
    address, 
    chain, 
    balance, 
    formatBalance, 
    getChainName, 
    truncateAddress 
  } = useWalletConnection();

  const chains = [
    { id: "ethereum", name: "Ethereum", symbol: "ETH", icon: ExternalLink },
    { id: "bsc", name: "BSC", symbol: "BNB", icon: Zap },
    { id: "solana", name: "Solana", symbol: "SOL", icon: DollarSign },
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", icon: Coins },
  ];

  // Fetch presale data on component mount
  useEffect(() => {
    const fetchPresaleData = async () => {
      try {
        setIsLoading(true);
        const [presaleResponse, statsResponse] = await Promise.all([
          getPresaleStatus(),
          getLiveStats()
        ]);
        
        if (presaleResponse.success) {
          setPresaleData(presaleResponse.data);
        }
        
        if (statsResponse.success) {
          setLiveStats(statsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching presale data:', error);
        toast.error('Failed to load presale data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPresaleData();
  }, []);

  // Fetch user data when wallet connects
  useEffect(() => {
    const fetchUserData = async () => {
      if (isConnected && address) {
        try {
          const response = await getUserData(address);
          if (response.success) {
            setUserData(response.data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [isConnected, address]);

  const stats = [
    { 
      label: "Current Price", 
      value: presaleData ? `$${presaleData.currentPrice.toFixed(5)}` : "$0.00001", 
      icon: TrendingUp 
    },
    { 
      label: "Total Raised", 
      value: liveStats ? `$${liveStats.totalRaised.toLocaleString()}` : "$125,000", 
      icon: Coins 
    },
    { 
      label: "Participants", 
      value: liveStats ? liveStats.totalParticipants.toLocaleString() : "847", 
      icon: Users 
    },
    { 
      label: "Your Balance", 
      value: isConnected ? `${formatBalance()} ${chain?.nativeCurrency?.symbol || 'ETH'}` : "Connect Wallet", 
      icon: Wallet 
    },
  ];

  // Wallet connection is now handled by the ConnectWalletButton component

  const handlePurchase = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Invalid Amount", {
        description: "Please enter a valid amount",
      });
      return;
    }

    if (!isConnected || !address) {
      toast.error("Wallet Not Connected", {
        description: "Please connect your wallet first",
      });
      return;
    }

    if (!presaleData) {
      toast.error("Presale Data Not Available", {
        description: "Please try again later",
      });
      return;
    }

    try {
      setIsProcessingPurchase(true);
      
      // For demo purposes, we'll simulate a transaction hash
      // In production, this would be the actual blockchain transaction hash
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 40)}`;
      
      const response = await processPurchase({
        walletAddress: address,
        amount: parseFloat(amount),
        chain: selectedChain,
        txHash: mockTxHash
      });

      if (response.success) {
        toast.success("Purchase Successful!", {
          description: `You received ${response.data.memeReceived.toLocaleString()} MEME tokens`,
        });
        
        // Update user data
        setUserData(prev => ({
          ...prev,
          totalContributed: response.data.totalContributed,
          memeBalance: response.data.newBalance
        }));
        
        setAmount("");
      } else {
        toast.error("Purchase Failed", {
          description: response.message || "Please try again",
        });
      }
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast.error("Purchase Failed", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsProcessingPurchase(false);
    }
  };

  const calculateTokens = () => {
    if (!amount || parseFloat(amount) <= 0) return "0";
    const price = presaleData?.currentPrice || 0.00001;
    return (parseFloat(amount) / price).toLocaleString();
  };

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
            title="MemeChain Presale" 
            subtitle="Secure your MEME tokens at discounted prices"
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
          <Card className="mt-6 p-4 bg-card border-border">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-primary font-semibold">
                {presaleData ? `${((presaleData.totalRaised / presaleData.hardCap) * 100).toFixed(1)}%` : '12.5%'}
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-primary rounded-full animate-pulse-glow" 
                style={{ 
                  width: presaleData ? `${(presaleData.totalRaised / presaleData.hardCap) * 100}%` : '12.5%' 
                }} 
              />
            </div>
            <div className="flex justify-between text-xs mt-2 text-muted-foreground">
              <span>
                {presaleData ? `$${presaleData.totalRaised.toLocaleString()} raised` : '$125,000 raised'}
              </span>
              <span>
                {presaleData ? `$${presaleData.hardCap.toLocaleString()} goal` : '$1,000,000 goal'}
              </span>
            </div>
          </Card>
        </div>
      </section>

      {/* Main Presale Section */}
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
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {chains.map((chainOption) => (
                      <button
                        key={chainOption.id}
                        className="p-4 bg-muted hover:bg-muted/80 rounded-lg border border-border hover:border-primary transition-all"
                      >
                        <chainOption.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <span className="text-sm font-medium">{chainOption.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Use the new ConnectWalletButton component */}
                  <ConnectWalletButton 
                    variant="presale" 
                    size="lg"
                    className="w-full"
                  />

                  <p className="text-xs text-muted-foreground mt-4">
                    By connecting, you agree to our Terms of Service
                  </p>
                </div>
              ) : (
                <div>
                  {/* Use the new ConnectWalletButton component for connected state */}
                  <div className="mb-6">
                    <ConnectWalletButton variant="presale" />
                  </div>

                  {/* Buy Section */}
                  <BuySection />
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

export default Presale;
