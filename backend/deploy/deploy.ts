import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Fixed: use provider to get balance
  const provider = ethers.provider; // or await ethers.getDefaultProvider() if needed
  const balance = await provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Change this to your real token address on Sepolia
  // If you don't have one yet → deploy a mock ERC20 first (see below)
  const lendingTokenAddress = "0xd8499d2Ca4197F3d2534b48bAc9A5D8DE01CbB3b"; // ← ← ← CHANGE THIS

  const StudentLending = await ethers.getContractFactory("StudentLending");
  const lending = await StudentLending.deploy(lendingTokenAddress);

  await lending.waitForDeployment();

  const address = await lending.getAddress();
  console.log("StudentLending deployed to →", address);

  console.log("Update your frontend with this address!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
