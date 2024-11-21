import { cookieStorage, createStorage } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, polygon } from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cookieToInitialState, WagmiProvider } from 'wagmi';

// 1. Get projectId from https://cloud.reown.com
const projectId = 'a0f87013894a0c18eb739e951c5a1af2'; //reown productId for walletkit

if (!projectId) {
    throw new Error('Project ID is not defined');
}

const networks = [mainnet, polygon];

//Set up the Wagmi Adapter (Config)
const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage,
    }),
    ssr: true,
    networks,
    projectId,
});

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
    throw new Error('Project ID is not defined');
}

// Set up metadata
const metadata = {
    //this is optional
    name: 'appkit-example', //wo name tu hum dy bi nahi rehy
    description: 'AppKit Example - EVM',
    url: 'https://reown-appkit-evm.vercel.app', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

// Create the modal
createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks,
    defaultNetwork: mainnet,
    metadata: metadata,
    features: {
        analytics: true, // Optional - defaults to your Cloud configuration
        email: true, // default to true
        socials: ['google', 'x', 'github', 'discord', 'apple', 'facebook', 'farcaster'],
        emailShowWallets: true, // default to true
    },
    themeMode: 'light',
});

function AppKitProvider({ children, cookies }) {
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies);

    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    );
}

export default AppKitProvider;
