import { Check, Clock, Lock, Moon, Rocket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LampDemo } from "@/components/LampDemo";
import { VortexSection } from "@/components/VortexSection";

const Roadmap = () => {
  const milestones = [
    {
      phase: "Q1 2025",
      title: "Presale Launch & Community Building",
      status: "current",
      items: [
        "Launch presale on multiple chains",
        "Community channels setup (Telegram, Discord)",
        "Initial marketing campaign",
        "Website and whitepaper release",
        "Smart contract audit",
      ],
    },
    {
      phase: "Q2 2025",
      title: "Testnet Launch",
      status: "upcoming",
      items: [
        "Deploy testnet blockchain",
        "Public testing and bug bounty program",
        "Developer documentation",
        "Block explorer launch",
        "Community validator program",
      ],
    },
    {
      phase: "Q3 2025",
      title: "Mainnet Launch",
      status: "upcoming",
      items: [
        "Official mainnet deployment",
        "Token migration to mainnet",
        "Wallet integrations",
        "First DApps deployment",
        "Staking program launch",
      ],
    },
    {
      phase: "Q4 2025",
      title: "DEX Listing & Partnerships",
      status: "upcoming",
      items: [
        "Major DEX listings",
        "Strategic partnerships",
        "Mobile wallet app",
        "Cross-chain bridges",
        "NFT marketplace beta",
      ],
    },
    {
      phase: "Q1 2026",
      title: "Ecosystem Expansion",
      status: "future",
      items: [
        "CEX listings",
        "DeFi protocols launch",
        "Gaming integrations",
        "DAO governance implementation",
        "Global marketing push",
      ],
    },
    {
      phase: "Q2 2026+",
      title: "Global Adoption",
      status: "future",
      items: [
        "Enterprise partnerships",
        "Layer 2 solutions",
        "Institutional integration",
        "Real-world use cases",
        "Mass adoption initiatives",
      ],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "current":
        return <Clock className="h-5 w-5 text-primary animate-pulse-glow" />;
      case "completed":
        return <Check className="h-5 w-5 text-secondary" />;
      default:
        return <Lock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "current":
        return "border-primary bg-primary/10";
      case "completed":
        return "border-secondary bg-secondary/10";
      default:
        return "border-border bg-card";
    }
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
            title="Roadmap to the Moon" 
            subtitle="Our journey from meme dream to blockchain reality"
          />
        </div>
      </div>
      
      <div className="pt-20 md:pt-24">

      {/* Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border" />

            {milestones.map((milestone, index) => (
              <div 
                key={index} 
                className="relative mb-12 last:mb-0"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className={`flex items-start gap-6 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}>
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 -ml-3 mt-6">
                    <div className={`h-6 w-6 rounded-full border-4 flex items-center justify-center ${
                      milestone.status === 'current' 
                        ? 'border-primary bg-primary animate-pulse-glow' 
                        : milestone.status === 'completed'
                        ? 'border-secondary bg-secondary'
                        : 'border-border bg-card'
                    }`}>
                      {getStatusIcon(milestone.status)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`flex-1 ml-16 md:ml-0 ${
                    index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                  }`}>
                    <Card className={`p-6 ${getStatusColor(milestone.status)} border-2 card-shadow hover:scale-105 transition-transform`}>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                          milestone.status === 'current' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {milestone.phase}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold mb-4">{milestone.title}</h3>
                      <ul className={`space-y-2 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                        {milestone.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-muted-foreground text-sm">
                            <span className={`mt-1 ${index % 2 === 0 ? 'md:order-1' : ''}`}>•</span>
                            <span className="flex-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom decoration */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <Rocket className="h-24 w-24 mx-auto mb-6 text-primary animate-float" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            The Journey Continues
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            This is just the beginning. Our community will help shape the future of MemeChain 
            through governance proposals and active participation.
          </p>
        </div>
      </section>
      </div>
    </div>
  );
};

export default Roadmap;
