import { Globe, Shield, Users, Zap, Link as LinkIcon, Zap as Lightning, Vote, Dog, Circle, Moon, Gem } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LampDemo } from "@/components/LampDemo";
import { VortexSection } from "@/components/VortexSection";
import logo from "/memelogo.png";

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Transparency",
      description: "Full on-chain transparency with audited smart contracts",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Pushing boundaries with cutting-edge blockchain technology",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Driven by our community, for our community",
    },
    {
      icon: Globe,
      title: "Accessibility",
      description: "Making blockchain fun and accessible to everyone",
    },
  ];

  const team = [
    { name: "Doge Master", role: "CEO & Founder", avatar: Dog },
    { name: "Pepe Chief", role: "CTO", avatar: Circle },
    { name: "Moon Hodler", role: "Head of Marketing", avatar: Moon },
    { name: "Diamond Hands", role: "Community Manager", avatar: Gem },
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
            title="What is MemeChain?" 
            subtitle="MemeChain is the world's first blockchain built entirely on meme culture and community power. We're combining the viral nature of memes with the security and transparency of blockchain technology."
          />
        </div>
      </div>
      
      <div className="pt-20 md:pt-24">

      {/* Mission */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our <span className="text-gradient">Mission</span>
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                To create a decentralized ecosystem where meme culture meets cutting-edge blockchain technology. 
                We believe in making crypto fun, accessible, and community-driven.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                MemeChain isn't just another blockchain—it's a movement. We're building a platform where creativity, 
                humor, and technology converge to create something truly revolutionary.
              </p>
            </div>
            <div className="relative h-80 md:h-96 lg:h-[28rem] flex items-center justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse-glow" />
                <div className="absolute inset-0 bg-card rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    src={logo} 
                    alt="MemeChain Logo" 
                    className="w-full h-full object-contain animate-float"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We're Building */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What We're <span className="text-gradient">Building</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-card border-border card-shadow hover:border-primary transition-all">
              <LinkIcon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Decentralized Network</h3>
              <p className="text-muted-foreground text-sm">
                A fully decentralized blockchain with consensus driven by community validators
              </p>
            </Card>
            <Card className="p-6 bg-card border-border card-shadow hover:border-primary transition-all">
              <Lightning className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Scalable Infrastructure</h3>
              <p className="text-muted-foreground text-sm">
                Built for speed and efficiency, handling thousands of transactions per second
              </p>
            </Card>
            <Card className="p-6 bg-card border-border card-shadow hover:border-primary transition-all">
              <Vote className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Community Governance</h3>
              <p className="text-muted-foreground text-sm">
                Token holders have voting power on major protocol decisions and upgrades
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Core <span className="text-gradient">Values</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className="p-6 bg-card border-border card-shadow hover:border-primary transition-all text-center"
              >
                <value.icon className="h-12 w-12 text-primary mb-4 mx-auto" />
                <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Meet the <span className="text-gradient">Team</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <Card 
                key={index} 
                className="p-6 bg-card border-border card-shadow hover:border-primary transition-all hover:scale-105 text-center group"
              >
                <member.avatar className="h-16 w-16 mx-auto mb-4 text-primary group-hover:animate-float" />
                <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join the Revolution?
          </h2>
          <Link to="/presale">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary text-lg px-8">
              Join Presale
            </Button>
          </Link>
        </div>
      </section>
      </div>
    </div>
  );
};

export default About;
