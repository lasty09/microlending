# StudentLending Smart Contracts
### Blockchain Micro-Lending Platform for Verified Students

> A decentralized finance (DeFi) platform enabling verified students to borrow funds from lenders using ERC20 tokens and smart contracts on the Ethereum Sepolia testnet.

🌐 **Live Frontend**: [microlending-nine.vercel.app](https://microlending-nine.vercel.app)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Quick Start](#quick-start)
- [Contract Overview](#contract-overview)
- [Deployment Guide](#deployment-guide)
- [Testing](#testing)
- [Workflow](#workflow)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

StudentLending is a DeFi micro-lending platform built on Ethereum that bridges the gap between lenders and verified students in need of short-term financing. Using smart contracts, the platform eliminates intermediaries, automates interest calculations, and ensures transparent, trustless lending — all secured on-chain.

Lenders deposit ERC20 tokens (defaulting to USDC) into the contract. An admin verifies student eligibility. Verified students can then borrow from the pool and repay with a fixed 5% interest rate. The entire lifecycle — deposit, verify, borrow, repay — is handled by the `StudentLending.sol` smart contract.

---

## Features

- **Decentralized Lending & Borrowing** — Trustless peer-to-pool lending between verified students and lenders
- **ERC20 Token Integration** — Supports any ERC20 token; defaults to USDC on Sepolia
- **Lender Deposit & Withdrawal** — Lenders can deposit and withdraw funds at any time
- **Student Verification System** — Admin-controlled verification ensures only eligible students can borrow
- **Automatic Interest Calculation** — Fixed 5% interest applied automatically on all loans
- **Mock ERC20 Token** — `MockERC20.sol` included for local testing without needing real USDC

---

## Tech Stack

| Layer | Technology |
|---|---|
| Smart Contracts | Solidity 0.8.20 + OpenZeppelin |
| Development Framework | Hardhat 2.19.4 |
| Network | Ethereum Sepolia Testnet |
| Testing | Chai + Hardhat Test Runner |
| Deployment | Hardhat Ignition Modules |
| Language | TypeScript |

---

## Project Structure

```
backend/
├── contracts/
│   ├── StudentLending.sol       # Main lending contract
│   └── MockERC20.sol            # Test ERC20 token
├── deploy/
│   ├── deploy.ts                # Deploys StudentLending contract
│   └── deployMockToken.ts       # Deploys MockERC20 token
├── ignition/
│   └── modules/                 # Hardhat Ignition deployment modules
├── scripts/
│   └── scripts.ts               # Test interaction scripts
├── test/                        # Additional test files
├── hardhat.config.ts            # Hardhat configuration
└── package.json                 # Dependencies & scripts
```

---

## Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A wallet with Sepolia ETH (for deployment)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/microlending-backend.git
cd microlending-backend
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
SEPOLIA_RPC_URL=https://rpc.sepolia.org
PRIVATE_KEY=your_wallet_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here   # Optional, for contract verification
```

> ⚠️ **Never commit your `.env` file.** Add it to `.gitignore` immediately.

| Variable | Required | Description |
|---|---|---|
| `SEPOLIA_RPC_URL` | ✅ Yes | RPC endpoint for Sepolia testnet |
| `PRIVATE_KEY` | ✅ Yes | Private key of the deployer wallet |
| `ETHERSCAN_API_KEY` | ❌ Optional | Used for verifying contracts on Etherscan |

---

## Quick Start

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
npm run test
```

### Local Development Node

Start a local Hardhat node in one terminal:

```bash
npm run node
```

Then deploy to local in another terminal:

```bash
npm run deploy:local
```

### Deploy to Sepolia Testnet

First deploy the mock token (if needed):

```bash
npm run deploy:mock --network sepolia
```

Then deploy the main lending contract:

```bash
npm run deploy --network sepolia
```

---

## Contract Overview

### `StudentLending.sol`

The core contract managing the full lending lifecycle.

| Function | Access | Description |
|---|---|---|
| `deposit(amount)` | Public | Lender deposits ERC20 tokens into the pool |
| `withdraw(amount)` | Public | Lender withdraws their deposited tokens |
| `verifyStudent(address)` | Admin only | Admin marks a student address as verified |
| `borrow(amount)` | Verified students | Borrow from the pool (repayment = principal × 1.05) |
| `repay(amount)` | Borrowers | Repay outstanding loan with 5% interest |

**Interest Formula:**
```
repaymentAmount = borrowedAmount + (borrowedAmount * 5 / 100)
```

---

### `MockERC20.sol`

A simple ERC20 token for local and testnet development. Allows the deployer to mint tokens freely, simulating USDC or any other stablecoin without needing real funds.

---

## Deployment Guide

### Step-by-step: Sepolia Testnet

**Step 1 — Fund your wallet**

Get Sepolia ETH from a faucet:
- [sepoliafaucet.com](https://sepoliafaucet.com)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com)

**Step 2 — Deploy MockERC20 (skip if using real USDC)**

```bash
npm run deploy:mock --network sepolia
```

Note the deployed token address printed in the console output.

**Step 3 — Update deploy.ts with the token address**

In `deploy/deploy.ts`, update the token address:

```typescript
const TOKEN_ADDRESS = "0xYourDeployedTokenAddressHere";
```

**Step 4 — Deploy StudentLending**

```bash
npm run deploy --network sepolia
```

**Step 5 — (Optional) Verify on Etherscan**

```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS "TOKEN_ADDRESS"
```

> Gas optimization is pre-configured in `hardhat.config.ts` with the Solidity optimizer enabled at 200 runs.

---

## Testing

The test suite covers the core deposit → verify → borrow workflow.

### Run all tests

```bash
npm run test
```

### What's tested

```
✔ Lender can deposit tokens into the pool
✔ Admin can verify a student address
✔ Verified student can borrow from the pool
✔ Loan amount is calculated correctly (principal + 5% interest)
✔ Student can repay the loan
✔ Unverified student cannot borrow
```

### Expected loan calculation

```
Borrow: 1000 USDC
Interest (5%): 50 USDC
Total Repayment: 1050 USDC
```

---

## Workflow

```
1. Deploy MockERC20 token
         ↓
2. Note token contract address
         ↓
3. Update deploy.ts with token address
         ↓
4. Deploy StudentLending contract
         ↓
5. Lender deposits ERC20 tokens
         ↓
6. Admin verifies student address
         ↓
7. Student borrows from the pool
         ↓
8. Student repays loan + 5% interest
         ↓
9. Lender withdraws funds
```

---

## Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Sepolia Testnet Faucet](https://sepoliafaucet.com)
- [Etherscan Sepolia](https://sepolia.etherscan.io)
- [Hardhat Ignition Docs](https://hardhat.org/ignition/docs/getting-started)

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please ensure all tests pass before submitting a PR:

```bash
npm run test
```

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">
  <sub>Built with Solidity, Hardhat, and OpenZeppelin · Deployed on Ethereum Sepolia</sub>
</div>
