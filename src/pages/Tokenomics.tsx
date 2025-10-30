import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Rocket, Droplets, Users, Gift, Shield, Zap } from "lucide-react";
import { LampDemo } from "@/components/LampDemo";
import { VortexSection } from "@/components/VortexSection";
import { useEffect, useMemo, useState } from "react";
import { getTokenomics, Tokenomics as TokenomicsResponse } from "@/lib/tokenomicsApi";

const Tokenomics = () => {
  const [tokenomics, setTokenomics] = useState<TokenomicsResponse | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTokenomics();
        setTokenomics(data);
      } catch (e) {
        // Keep page rendering with defaults if API fails
      }
    };
    load();
  }, []);

  const distribution = useMemo(() => {
    if (!tokenomics) return [] as Array<{ name: string; value: number; color: string; amount: number; }>;
    const total = tokenomics.total_supply || 1;
    const entries = [
      { name: "Presale", key: "presale", color: "hsl(75, 100%, 63%)" },
      { name: "Liquidity", key: "liquidity", color: "hsl(180, 100%, 50%)" },
      { name: "Marketing", key: "marketing", color: "hsl(180, 100%, 40%)" },
      { name: "Team", key: "team", color: "hsl(210, 50%, 40%)" },
      { name: "Community", key: "community", color: "hsl(210, 50%, 50%)" },
      { name: "Reserve", key: "reserve", color: "hsl(210, 40%, 30%)" },
    ] as const;
    return entries.map(e => {
      const amount = tokenomics.distribution[e.key as keyof typeof tokenomics.distribution] || 0;
      return { name: e.name, value: Math.round((amount / total) * 100), color: e.color, amount };
    });
  }, [tokenomics]);

  const priceStages = useMemo(() => {
    if (!tokenomics) return [] as Array<{ stage: string; price: string; allocation: string }>;
    return [
      { stage: "Stage 1", price: `$${tokenomics.presale_stage1_price}`, allocation: "Presale stage 1" },
      { stage: "Stage 2", price: `$${tokenomics.presale_stage2_price}`, allocation: "Presale stage 2" },
      { stage: "Stage 3", price: `$${tokenomics.presale_stage3_price}`, allocation: "Presale stage 3" },
    ];
  }, [tokenomics]);

  const allocations = useMemo(() => {
    if (!tokenomics) return [] as Array<{ category: string; percentage: string; amount: string; unlock: string; icon: any }>;
    const total = tokenomics.total_supply || 1;
    const specs = [
      { key: 'presale', label: 'Presale', icon: Rocket, unlock: 'Airdrop after mainnet launch' },
      { key: 'liquidity', label: 'Liquidity', icon: Droplets, unlock: 'Locked for 12 months' },
      { key: 'team', label: 'Team', icon: Users, unlock: '12-month cliff, 24-month vesting' },
      { key: 'marketing', label: 'Marketing', icon: Zap, unlock: 'Released over 18 months' },
      { key: 'community', label: 'Community', icon: Gift, unlock: 'Staking and engagement rewards' },
      { key: 'reserve', label: 'Reserve', icon: Shield, unlock: 'Emergency fund, locked' },
    ] as const;
    return specs.map(s => {
      const amountNum = tokenomics.distribution[s.key as keyof typeof tokenomics.distribution] || 0;
      const pct = `${Math.round((amountNum / total) * 100)}%`;
      return {
        category: s.label,
        percentage: pct,
        amount: `${amountNum.toLocaleString()} MEME`,
        unlock: s.unlock,
        icon: s.icon,
      };
    });
  }, [tokenomics]);

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
            title="Tokenomics" 
            subtitle="Fair distribution designed for long-term sustainability"
          />
        </div>
      </div>
      
      <div className="pt-20 md:pt-24">

      {/* Total Supply */}
      <section className="py-12 bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-2xl mx-auto p-8 bg-card border-primary/50 border-2 card-shadow">
            <p className="text-sm text-muted-foreground mb-2">Total Supply</p>
            <h2 className="text-4xl md:text-6xl font-bold text-gradient mb-2">
              {tokenomics ? tokenomics.total_supply.toLocaleString() : '—'}
            </h2>
            <p className="text-xl text-foreground">MEME Tokens</p>
          </Card>
        </div>
      </section>

      {/* Distribution Chart */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Token <span className="text-gradient">Distribution</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Chart */}
            <Card className="p-6 bg-card border-border card-shadow">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={distribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Legend */}
            <div className="space-y-4">
              {distribution.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div 
                    className="w-6 h-6 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.value}%</p>
                  </div>
                  <p className="text-lg font-bold text-primary">
                    {item.amount?.toLocaleString()} MEME
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Allocation Details */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Allocation <span className="text-gradient">Details</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allocations.map((allocation, index) => (
              <Card 
                key={index} 
                className="p-6 bg-card border-border card-shadow hover:border-primary transition-all"
              >
                <allocation.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{allocation.category}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Percentage:</span>
                    <span className="text-primary font-semibold">{allocation.percentage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-semibold">{allocation.amount}</span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-muted-foreground text-xs">{allocation.unlock}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Price Information */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Presale <span className="text-gradient">Pricing</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {priceStages.map((stage, index) => (
              <Card 
                key={index} 
                className={`p-6 text-center border-2 card-shadow ${
                  index === 0 ? 'border-primary bg-primary/10' : 'border-border bg-card'
                }`}
              >
                <p className="text-sm text-muted-foreground mb-2">{stage.stage}</p>
                <h3 className="text-3xl font-bold text-primary mb-2">{stage.price}</h3>
                <p className="text-sm text-muted-foreground">per MEME</p>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">{stage.allocation}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto p-6 bg-card border-border">
              <h3 className="text-xl font-bold mb-4">Potential ROI</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Stage 1 to Listing</p>
                  <p className="text-2xl font-bold text-secondary">200%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Stage 2 to Listing</p>
                  <p className="text-2xl font-bold text-secondary">100%</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Vesting Schedule */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Vesting <span className="text-gradient">Schedule</span>
          </h2>
          
          <Card className="max-w-4xl mx-auto p-8 bg-card border-border card-shadow">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div className="flex-1">
                  <h3 className="font-bold mb-2">Team Tokens</h3>
                  <p className="text-sm text-muted-foreground">
                    12-month cliff period followed by linear vesting over 24 months. 
                    Ensures long-term commitment from the team.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-secondary rounded-full mt-2" />
                <div className="flex-1">
                  <h3 className="font-bold mb-2">Liquidity Pool</h3>
                  <p className="text-sm text-muted-foreground">
                    Locked for 12 months to ensure price stability and prevent rug pulls. 
                    Additional liquidity may be added based on market conditions.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                <div className="flex-1">
                  <h3 className="font-bold mb-2">Marketing Budget</h3>
                  <p className="text-sm text-muted-foreground">
                    Released gradually over 18 months aligned with marketing milestones 
                    and community growth initiatives.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
      </div>
    </div>
  );
};

export default Tokenomics;
