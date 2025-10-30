import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LampDemo } from "@/components/LampDemo";
import { VortexSection } from "@/components/VortexSection";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: "General",
      questions: [
        {
          q: "What is MemeChain?",
          a: "MemeChain is a next-generation blockchain platform that combines meme culture with cutting-edge technology. It's designed to be fast, secure, and community-driven, making blockchain accessible and fun for everyone.",
        },
        {
          q: "Why should I invest in MemeChain?",
          a: "MemeChain offers unique value through its community-first approach, multi-chain support, and innovative tokenomics. Early participants in the presale get significant discounts compared to the listing price, with potential ROI of up to 200%.",
        },
        {
          q: "Is MemeChain safe and legitimate?",
          a: "Yes! Our smart contracts are fully audited by reputable firms, and we maintain complete transparency. All transactions are verifiable on-chain, and our team is doxxed and committed to long-term success.",
        },
      ],
    },
    {
      category: "Presale",
      questions: [
        {
          q: "How do I participate in the presale?",
          a: "Simply connect your wallet on our Presale page, select your preferred payment method (ETH, BNB, SOL, or BTC), enter the amount you want to contribute, and confirm the transaction. Your MEME tokens will be allocated to your virtual balance.",
        },
        {
          q: "What chains can I use to buy?",
          a: "We support multiple blockchains including Ethereum, Binance Smart Chain, Solana, and Bitcoin. This gives you flexibility to participate using your preferred network and reduces transaction costs.",
        },
        {
          q: "When will I receive my tokens?",
          a: "Your MEME token balance will be shown immediately in your dashboard. The actual tokens will be airdropped to your wallet after the mainnet launch in Q3 2025.",
        },
        {
          q: "What is the minimum purchase amount?",
          a: "The minimum purchase amount is $10 worth of cryptocurrency. There is no maximum limit, but we encourage fair distribution among all participants.",
        },
      ],
    },
    {
      category: "Tokenomics",
      questions: [
        {
          q: "What is the total supply of MEME tokens?",
          a: "The total supply is fixed at 21 billion MEME tokens. This supply is carefully distributed across presale, liquidity, team, marketing, community rewards, and reserve allocations.",
        },
        {
          q: "How is the token distributed?",
          a: "40% is allocated to presale, 20% to liquidity, 15% to marketing, 10% each to team and community rewards, and 5% to reserve. All allocations have specific vesting schedules to ensure long-term sustainability.",
        },
        {
          q: "Are team tokens locked?",
          a: "Yes! Team tokens have a 12-month cliff period followed by linear vesting over 24 months. This ensures the team is committed to long-term success and prevents early dumps.",
        },
      ],
    },
    {
      category: "Technical",
      questions: [
        {
          q: "Which wallets are supported?",
          a: "We support all major wallets including MetaMask, WalletConnect, Phantom (for Solana), and various Bitcoin wallets. More wallet integrations will be added based on community requests.",
        },
        {
          q: "When will the blockchain launch?",
          a: "Our testnet is scheduled for Q2 2025, with the mainnet launch planned for Q3 2025. Follow our roadmap for detailed milestones and stay updated through our community channels.",
        },
        {
          q: "Will there be staking?",
          a: "Yes! Staking will be available after mainnet launch. Token holders will be able to stake their MEME tokens to earn rewards and participate in network validation.",
        },
        {
          q: "How fast are transactions?",
          a: "MemeChain is designed for high throughput with transaction finality in seconds. Our infrastructure can handle thousands of transactions per second, making it suitable for various applications.",
        },
      ],
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
            title="Frequently Asked Questions" 
            subtitle="Got Questions? We've Got Answers!"
          />
        </div>
      </div>
      
      <div className="pt-20 md:pt-24">

      {/* Search */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full px-6 py-4 bg-card border border-border rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gradient">
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex;
                    const isOpen = openIndex === globalIndex;
                    
                    return (
                      <Card
                        key={faqIndex}
                        className="bg-card border-border card-shadow overflow-hidden hover:border-primary transition-all"
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                          className="w-full p-6 text-left flex items-start justify-between gap-4"
                        >
                          <h3 className="text-lg font-semibold pr-4">{faq.q}</h3>
                          <ChevronDown
                            className={`h-5 w-5 text-primary flex-shrink-0 transition-transform ${
                              isOpen ? "transform rotate-180" : ""
                            }`}
                          />
                        </button>
                        <div
                          className={`transition-all duration-300 ${
                            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                          } overflow-hidden`}
                        >
                          <div className="px-6 pb-6">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.a}
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Still Have Questions?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community channels to get instant support from our team and community members
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors glow-primary">
              Join Telegram
            </button>
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors glow-primary">
              Discord Server
            </button>
            <button className="px-6 py-3 bg-transparent border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default FAQ;
