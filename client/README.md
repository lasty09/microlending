

\# MicroLend — Frontend



\## Overview



React + TypeScript frontend for the MicroLend platform. Connects to the StudentLending smart contract on Sepolia testnet via Wagmi v2 and RainbowKit.



\## Pages



| Route | Component | Description |

|---|---|---|

| `/` | Dashboard | Pool stats, loan status, deposit and borrow dialogs |

| `/borrow` | Borrow | Loan application form with live summary |

| `/lend` | Lend | Deposit interface and lender benefits |

| `/how-it-works` | HowItWorks | Platform explainer |



\## Key Libraries



| Library | Purpose |

|---|---|

| Wagmi v2 | React hooks for blockchain interaction |

| RainbowKit | Wallet connection UI |

| Viem | ABI encoding, unit parsing |

| MUI v7 | UI components |

| TailwindCSS v4 | Utility styling |

| React Router v7 | Client-side routing |



\## Blockchain Interaction Pattern



Reading from chain (free, no gas):

```typescript

const { data } = useReadContract({

&#x20; address: CONTRACT\_ADDRESS,

&#x20; abi: ABI,

&#x20; functionName: "getLoanDetails",

&#x20; args: \[address],

});

```



Writing to chain (requires gas + MetaMask confirmation):

```typescript

const { writeContract } = useWriteContract();

writeContract({

&#x20; address: CONTRACT\_ADDRESS,

&#x20; abi: ABI,

&#x20; functionName: "borrow",

&#x20; args: \[parseUnits("15000", 2)],

});

```



\## Token Decimal Handling



The MockERC20 token uses 2 decimals. All UI values are in KSh display units:



```typescript

// KSh 15,000 display → 1,500,000 on-chain

parseUnits("15000", 2) // → 1500000n



// 1,500,000 on-chain → KSh 15,000 display

formatUnits(1500000n, 2) // → "15000"

```



\## Two-Step Token Flow



Depositing and repaying require ERC20 approval before the contract can pull tokens:

