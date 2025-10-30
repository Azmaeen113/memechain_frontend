import React from 'react';
import { BuySection } from '@/components/BuySection';
import { ConnectWalletButton } from '@/components/ConnectWalletButton';

export function BuyTestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Buy Section Test</h1>
        
        {/* Wallet Connection */}
        <div className="mb-8">
          <ConnectWalletButton variant="default" />
        </div>
        
        {/* Buy Section */}
        <BuySection />
      </div>
    </div>
  );
}


