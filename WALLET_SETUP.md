# Wallet Connection Setup Guide

This guide explains how to set up wallet connections for the MemeChain presale application.

## Environment Variables

The `.env.local` file has been created with the correct WalletConnect Project ID:

```bash
# WalletConnect Project ID - Get from https://cloud.walletconnect.com/
VITE_WALLETCONNECT_PROJECT_ID=32f69a4af876e8f694e3bb99749029c3

# Default Chain ID (1 = Ethereum Mainnet)
VITE_CHAIN_ID=1
```

## Recent Updates

✅ **Fixed Wallet Connection Issues:**
- Added proper WalletConnect Project ID configuration
- Enhanced error handling and wallet detection
- Improved MetaMask integration with better user feedback
- Added comprehensive wallet availability checks

✅ **Enhanced Chain Switching:**
- Support for multiple networks (Ethereum, Polygon, BSC, Arbitrum, Base, Sepolia)
- Visual indicators for recommended networks
- Automatic chain detection and switching prompts
- Better error handling for unsupported networks

✅ **Improved User Experience:**
- Loading states during connection
- Clear error messages and troubleshooting hints
- Wallet installation prompts for users without wallets
- Enhanced debugging tools with WalletTest component

## Getting Your WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up or log in to your account
3. Create a new project
4. Copy your Project ID
5. Add it to your `.env.local` file

## Supported Networks

The application now supports **15+ high-ranking blockchain networks**:

### 🏆 **Top-Tier Networks (Priority 1-5)**
- **Ethereum Mainnet** (Chain ID: 1) - 🔷 ETH
- **Polygon** (Chain ID: 137) - 🟣 MATIC  
- **BSC** (Chain ID: 56) - 🟡 BNB
- **Arbitrum** (Chain ID: 42161) - 🔵 ETH
- **Base** (Chain ID: 8453) - 🔵 ETH

### 🚀 **High-Performance Networks (Priority 6-10)**
- **Optimism** (Chain ID: 10) - 🔴 ETH
- **Avalanche** (Chain ID: 43114) - 🔴 AVAX
- **Fantom** (Chain ID: 250) - 🔵 FTM
- **Gnosis** (Chain ID: 100) - 🟢 GNO
- **zkSync Era** (Chain ID: 324) - ⚡ ETH

### 🔥 **Emerging Networks (Priority 11-14)**
- **Linea** (Chain ID: 59144) - 🔵 ETH
- **Scroll** (Chain ID: 534352) - 🟦 ETH
- **Mantle** (Chain ID: 5000) - 🟤 MNT
- **Blast** (Chain ID: 81457) - 💥 ETH

### 🧪 **Test Networks**
- **Sepolia** (Chain ID: 11155111) - 🧪 ETH (for testing)

### ⚡ **Solana Support**
- **Solana Mainnet** - Purple SOL (requires Phantom, Solflare, or Backpack wallet)

## Supported Wallets

The following wallets are supported through RainbowKit:

- MetaMask
- WalletConnect
- Coinbase Wallet
- Rainbow Wallet
- Trust Wallet
- And many more...

## Features

### 🔗 **Multi-Chain Wallet Connection**
- **EVM Chains**: Support for 14+ EVM-compatible networks
- **Solana Support**: Dedicated Solana wallet integration
- **Priority-Based Organization**: Networks sorted by market cap and popularity
- **Smart Detection**: Automatic wallet and network detection

### 🎛️ **Advanced Chain Switching**
- **Quick Switcher**: Compact dropdown for navigation bars
- **Detailed Switcher**: Full-featured network selection with visual cards
- **Priority Indicators**: Star ratings for top-tier networks
- **Network Icons**: Visual emoji indicators for each chain
- **Explorer Links**: Direct links to blockchain explorers

### 📱 **Responsive UI Components**
- **Navigation Bar**: Compact wallet display with quick chain switching
- **Presale Page**: Comprehensive wallet interface with full network support
- **Settings Page**: Detailed network configuration and management
- **Mobile Optimized**: Touch-friendly interface for mobile devices

### 🔧 **Wallet Actions**
- **Connect**: Opens wallet selection modal with multi-chain support
- **Disconnect**: Safely disconnects from all connected networks
- **Switch Network**: Seamless switching between 15+ supported networks
- **Copy Address**: Copies wallet address to clipboard
- **View on Explorer**: Opens appropriate blockchain explorer
- **Balance Display**: Shows native token balance for each network

### 🧪 **Testing & Debugging**
- **WalletTest Component**: Comprehensive testing interface
- **Multi-Chain Tabs**: Separate testing for EVM and Solana
- **Debug Information**: Detailed connection status and network info
- **Error Handling**: Clear error messages and recovery suggestions

## Usage

### Basic Wallet Connection
```tsx
import { ConnectWalletButton } from '@/components/ConnectWalletButton';

function MyComponent() {
  return <ConnectWalletButton variant="default" />;
}
```

### Chain Switching Components
```tsx
import { ChainSwitcher, QuickChainSwitcher, FullChainSwitcher } from '@/components/ChainSwitcher';

// Quick switcher for navigation bars
<QuickChainSwitcher />

// Detailed switcher for settings pages
<FullChainSwitcher />

// Custom switcher with options
<ChainSwitcher 
  variant="detailed" 
  showTopTierOnly={false} 
/>
```

### Solana Wallet Integration
```tsx
import { SolanaWalletConnector, MultiChainWalletConnector } from '@/components/SolanaWalletConnector';

// Solana-only connector
<SolanaWalletConnector />

// Multi-chain connector (EVM + Solana)
<MultiChainWalletConnector />
```

### Using the Enhanced Hook
```tsx
import { useWalletConnection } from '@/components/ConnectWalletButton';

function MyComponent() {
  const { 
    isConnected, 
    address, 
    chain,
    chainId,
    connector,
    balance,
    isWalletAvailable,
    isMainnet,
    connect,
    disconnect,
    switchChain,
    truncateAddress,
    formatBalance,
    getChainName
  } = useWalletConnection();

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Connected: {truncateAddress(address)}</p>
          <p>Network: {getChainName()} (ID: {chainId})</p>
          <p>Balance: {formatBalance()} {chain?.nativeCurrency?.symbol}</p>
          <p>Mainnet: {isMainnet ? 'Yes' : 'No'}</p>
          <button onClick={switchChain}>Switch Network</button>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  );
}
```

### Testing Components
```tsx
import { WalletTest } from '@/components/WalletTest';

// Add this to any page for comprehensive testing
<WalletTest />
```

## Troubleshooting

### Wallet Not Connecting
1. ✅ **Check Wallet Installation**: Ensure MetaMask or another supported wallet is installed
2. ✅ **Unlock Wallet**: Make sure your wallet is unlocked and ready for connections
3. ✅ **Browser Compatibility**: Try refreshing the page or using a different browser
4. ✅ **Extension Conflicts**: Disable other wallet extensions that might conflict
5. ✅ **Project ID**: Verify the WalletConnect Project ID is correctly set (already configured)

### Common Issues & Solutions

**"No wallet detected" Error:**
- Install MetaMask from [metamask.io](https://metamask.io/download/)
- Ensure the extension is enabled in your browser
- Try refreshing the page after installation

**"Failed to connect wallet" Error:**
- Check if your wallet is unlocked
- Try disconnecting and reconnecting
- Clear browser cache and cookies
- Check browser console for detailed error messages

**Wrong Network Issues:**
- Use the "Switch Network" button in the wallet interface
- Manually switch networks in your wallet extension
- Supported networks: Ethereum, Polygon, BSC, Arbitrum, Base, Sepolia

**Transaction Failures:**
- Ensure you have sufficient balance for gas fees
- Check that you're on the correct network
- Verify transaction parameters are correct
- Try increasing gas limit if transactions fail

### Testing Wallet Connection

Use the `WalletTest` component for debugging:
```tsx
import { WalletTest } from '@/components/WalletTest';

// Add this to any page for testing
<WalletTest />
```

This component provides:
- Real-time wallet detection status
- Connection state monitoring
- Network information display
- Debug information for troubleshooting

## Security Notes

- Never share your private keys or seed phrases
- Always verify transaction details before signing
- Use official wallet extensions only
- Be cautious of phishing attempts

## Development

For development purposes, a demo WalletConnect Project ID is used if none is provided. This should be replaced with a real Project ID for production use.
