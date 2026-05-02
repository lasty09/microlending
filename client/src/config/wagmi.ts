import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected, metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    metaMask(), // Supports MetaMask + Brave Wallet
    injected(), // Fallback for other injected wallets
  ],
  transports: {
    [sepolia.id]: http(
      "https://eth-sepolia.g.alchemy.com/v2/owM_j1tPi885DmLErgItK",
    ), // free public RPC
    // OR use your Alchemy: http('https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY')
  },
});
