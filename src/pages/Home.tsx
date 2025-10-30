import { Link } from "react-router-dom";
import { Rocket, Users, Zap, Shield, TrendingUp, Coins, Clock, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useMemo } from "react";
import { getCountdownSettings, CountdownSettings } from "@/lib/countdownApi";
import { getLiveStats, LiveStats } from "@/lib/liveStatsApi";
import { getTokenomics, Tokenomics } from "@/lib/tokenomicsApi";
import logo from "/memelogo.png";

const Home = () => {
  const [countdownSettings, setCountdownSettings] = useState<CountdownSettings | null>(null);
  const [liveStats, setLiveStats] = useState<LiveStats | null>(null);
  const [tokenomics, setTokenomics] = useState<Tokenomics | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Resolve a reliable target timestamp from settings/live stats with robust fallbacks
  const resolveTargetMs = () => {
    const raw = countdownSettings?.target_date;
    if (raw) {
      // Try as-is
      let d = new Date(raw);
      if (!Number.isNaN(d.getTime())) return d.getTime();
      // Replace space with T
      d = new Date(raw.replace(' ', 'T'));
      if (!Number.isNaN(d.getTime())) return d.getTime();
      // Append Z if no timezone
      const hasT = raw.includes('T');
      const hasTz = /[zZ]|[+-]\d{2}:?\d{2}$/.test(raw);
      const withZ = (hasT ? raw : raw.replace(' ', 'T')) + (hasTz ? '' : 'Z');
      d = new Date(withZ);
      if (!Number.isNaN(d.getTime())) return d.getTime();
    }
    // Fallback to liveStats days_to_launch if present
    if (liveStats?.days_to_launch != null) {
      const days = Number(liveStats.days_to_launch);
      if (!Number.isNaN(days) && days >= 0) {
        return Date.now() + days * 24 * 60 * 60 * 1000;
      }
    }
    // Final fallback: 30 days from now
    return Date.now() + 30 * 24 * 60 * 60 * 1000;
  };

  // Load countdown settings and live stats from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load countdown settings
        const settings = await getCountdownSettings();
        setCountdownSettings(settings);
      } catch (error) {
        console.error('Error loading countdown settings:', error);
        // Set default settings if API fails
        setCountdownSettings({
          // Use full ISO so Date parsing is consistent
          target_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          title: 'Memechain Presale',
          description: 'Get ready for the biggest meme coin presale!',
          is_active: true
        });
      }

      try {
        // Load live stats
        const stats = await getLiveStats();
        setLiveStats(stats);
      } catch (error) {
        console.error('Error loading live stats:', error);
        // Set default stats if API fails
        setLiveStats({
          participants: 847,
          raised_amount: 125000,
          tokens_allocated: '12.5B',
          days_to_launch: 71,
          is_active: true
        });
      }

      try {
        // Load tokenomics
        const tokenomicsData = await getTokenomics();
        setTokenomics(tokenomicsData);
      } catch (error) {
        console.error('Error loading tokenomics:', error);
        // Set default tokenomics if API fails
        setTokenomics({
          total_supply: 1000000000,
          presale_stage1_price: 0.001,
          presale_stage2_price: 0.002,
          presale_stage3_price: 0.003,
          presale_stage4_price: 0.004,
          presale_stage5_price: 0.005,
          public_sale_price: 0.01,
          distribution: {
            team: 150000000,
            presale: 300000000,
            liquidity: 200000000,
            marketing: 100000000,
            reserve: 150000000,
            community: 100000000
          },
          is_active: true
        });
      }
    };

    loadData();
  }, []);

  // Update countdown timer
  useEffect(() => {
    if (!countdownSettings?.is_active || !countdownSettings?.target_date) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const timer = setInterval(() => {
      const now = Date.now();
      const targetMs = resolveTargetMs();
      const distance = targetMs - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countdownSettings, liveStats]);
  const features = [
    {
      icon: Zap,
      title: "Multi-Chain Support",
      description: "Buy with ETH, BNB, SOL, or BTC - we support all major blockchains",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built by meme lovers, for meme lovers. Join thousands of holders",
    },
    {
      icon: Shield,
      title: "Secure & Transparent",
      description: "Audited smart contracts and fully transparent tokenomics",
    },
    {
      icon: Rocket,
      title: "Instant Transactions",
      description: "Lightning-fast processing on our next-gen blockchain",
    },
  ];

  const stats = [
    { 
      label: "Participants", 
      value: liveStats ? liveStats.participants.toLocaleString() : "847", 
      icon: Users 
    },
    { 
      label: "Raised", 
      value: liveStats ? `$${(liveStats.raised_amount / 1000).toFixed(0)}K` : "$125K", 
      icon: TrendingUp 
    },
    { 
      label: "Tokens Allocated", 
      value: liveStats ? liveStats.tokens_allocated : "12.5B", 
      icon: Coins 
    },
    { 
      label: "Days to Launch", 
      value: liveStats ? liveStats.days_to_launch.toString() : timeLeft.days.toString(), 
      icon: Clock 
    },
  ];

  const roadmap = [
    { phase: "Q1 2025", title: "Presale Launch", status: "current" },
    { phase: "Q2 2025", title: "Testnet Launch", status: "upcoming" },
    { phase: "Q3 2025", title: "Mainnet Launch", status: "upcoming" },
    { phase: "Q4 2025", title: "DEX Listing", status: "upcoming" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-24 sparkles-hidden">
        {/* Video Background */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/energy.mp4" type="video/mp4" />
        </video>
        
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-transparent z-10" />
        
        <div className="container mx-auto px-4 text-center relative z-20">
          <img 
            src={logo} 
            alt="MemeChain" 
            className="h-28 w-28 md:h-36 md:w-36 lg:h-44 lg:w-44 mx-auto mb-3 md:mb-4 animate-float object-cover relative z-50"
            style={{ clipPath: 'inset(8% 8% 8% 8%)' }}
          />
          
          <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 md:mb-4 animate-slide-up">
            The Blockchain That <br />
            <span className="text-gradient">Memes Harder</span> Than You Do! <Rocket className="inline-block w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-primary animate-float ml-2" />
          </h1>
          
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Join the revolution where blockchain meets meme culture. Fast, secure, and ridiculously fun.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/presale">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary text-sm md:text-base px-4 md:px-6 py-2">
                Join Presale Now
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-sm md:text-base px-4 md:px-6 py-2 border-primary text-primary hover:bg-primary/10">
              Read Whitepaper
            </Button>
          </div>

          {/* Countdown Timer */}
          {countdownSettings?.is_active && (
            <div className="mt-6 md:mt-8 lg:mt-10 inline-block bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-3 md:p-4 lg:p-6 xl:p-8 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <p className="text-xs text-muted-foreground mb-2">
                {countdownSettings?.title || "Presale Ends In"}
              </p>
              {countdownSettings?.description && (
                <p className="text-sm text-muted-foreground mb-3">{countdownSettings.description}</p>
              )}
              <div className="flex gap-2 md:gap-3 lg:gap-6 xl:gap-8 text-center">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Minutes", value: timeLeft.minutes },
                  { label: "Seconds", value: timeLeft.seconds }
                ].map((item, i) => (
                  <div key={item.label} className="flex flex-col">
                    <span className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-primary">
                      {item.value.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs lg:text-sm text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                Target: {new Date(resolveTargetMs()).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why <span className="text-gradient">MemeChain</span>?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="p-6 bg-card border-border hover:border-primary transition-all duration-300 hover:scale-105 card-shadow group"
              >
                <feature.icon className="h-12 w-12 text-primary mb-4 group-hover:animate-pulse-glow" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Live <span className="text-gradient">Stats</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center bg-card border-border card-shadow">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-secondary" />
                <p className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="text-gradient">Roadmap</span> to the Moon
          </h2>
          <div className="flex items-center justify-center mb-12">
            <Moon className="w-8 h-8 md:w-10 md:h-10 text-primary animate-float" />
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border" />
              
              {roadmap.map((item, index) => (
                <div 
                  key={index} 
                  className={`relative mb-8 ${index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2'}`}
                >
                  <div className={`flex items-center gap-4 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    {/* Dot */}
                    <div className={`absolute left-4 md:left-1/2 -ml-2 h-4 w-4 rounded-full border-4 ${
                      item.status === 'current' ? 'bg-primary border-primary animate-pulse-glow' : 'bg-card border-border'
                    }`} />
                    
                    <Card className={`flex-1 p-6 ml-12 md:ml-0 ${
                      index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                    } bg-card border-border card-shadow hover:border-primary transition-all`}>
                      <p className="text-sm text-primary font-semibold mb-1">{item.phase}</p>
                      <h3 className="text-xl font-bold">{item.title}</h3>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/roadmap">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                View Full Roadmap
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      {tokenomics && (
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-gradient">Tokenomics</span>
            </h2>
            
            {/* Total Supply */}
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold mb-4">Total Supply</h3>
              <p className="text-4xl md:text-5xl font-bold text-primary">
                {tokenomics.total_supply.toLocaleString()}
              </p>
              <p className="text-muted-foreground mt-2">MEME Tokens</p>
            </div>

            {/* Token Distribution */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center mb-8">Token Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-card border-border hover:border-primary transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold">Team</h4>
                    <span className="text-primary font-bold">15%</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{tokenomics.distribution.team.toLocaleString()}</p>
                </Card>
                
                <Card className="p-6 bg-card border-border hover:border-primary transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold">Presale</h4>
                    <span className="text-primary font-bold">30%</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{tokenomics.distribution.presale.toLocaleString()}</p>
                </Card>
                
                <Card className="p-6 bg-card border-border hover:border-primary transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold">Liquidity</h4>
                    <span className="text-primary font-bold">20%</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{tokenomics.distribution.liquidity.toLocaleString()}</p>
                </Card>
                
                <Card className="p-6 bg-card border-border hover:border-primary transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold">Marketing</h4>
                    <span className="text-primary font-bold">10%</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{tokenomics.distribution.marketing.toLocaleString()}</p>
                </Card>
                
                <Card className="p-6 bg-card border-border hover:border-primary transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold">Reserve</h4>
                    <span className="text-primary font-bold">15%</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{tokenomics.distribution.reserve.toLocaleString()}</p>
                </Card>
                
                <Card className="p-6 bg-card border-border hover:border-primary transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold">Community</h4>
                    <span className="text-primary font-bold">10%</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{tokenomics.distribution.community.toLocaleString()}</p>
                </Card>
              </div>
            </div>

            {/* Presale Pricing */}
            <div>
              <h3 className="text-2xl font-bold text-center mb-8">Presale Pricing</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card className="p-4 bg-card border-border hover:border-primary transition-all duration-300 text-center">
                  <h4 className="text-sm font-bold mb-2">Stage 1</h4>
                  <p className="text-primary font-bold text-xl">${tokenomics.presale_stage1_price}</p>
                </Card>
                
                <Card className="p-4 bg-card border-border hover:border-primary transition-all duration-300 text-center">
                  <h4 className="text-sm font-bold mb-2">Stage 2</h4>
                  <p className="text-primary font-bold text-xl">${tokenomics.presale_stage2_price}</p>
                </Card>
                
                <Card className="p-4 bg-card border-border hover:border-primary transition-all duration-300 text-center">
                  <h4 className="text-sm font-bold mb-2">Stage 3</h4>
                  <p className="text-primary font-bold text-xl">${tokenomics.presale_stage3_price}</p>
                </Card>
                
                <Card className="p-4 bg-card border-border hover:border-primary transition-all duration-300 text-center">
                  <h4 className="text-sm font-bold mb-2">Stage 4</h4>
                  <p className="text-primary font-bold text-xl">${tokenomics.presale_stage4_price}</p>
                </Card>
                
                <Card className="p-4 bg-card border-border hover:border-primary transition-all duration-300 text-center">
                  <h4 className="text-sm font-bold mb-2">Stage 5</h4>
                  <p className="text-primary font-bold text-xl">${tokenomics.presale_stage5_price}</p>
                </Card>
                
                <Card className="p-4 bg-card border-border hover:border-primary transition-all duration-300 text-center">
                  <h4 className="text-sm font-bold mb-2">Public Sale</h4>
                  <p className="text-primary font-bold text-xl">${tokenomics.public_sale_price}</p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Community Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our <span className="text-gradient">Community</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with thousands of meme enthusiasts and blockchain believers
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
              Join Telegram
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Follow Twitter
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Discord Server
            </Button>
          </div>

          {/* Newsletter */}
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Join the <span className="text-gradient">Revolution</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Don't miss out on the presale. Secure your MEME tokens today!
          </p>
          <Link to="/presale">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary text-xl px-12 py-6">
              Join Presale Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
