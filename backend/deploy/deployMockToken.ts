import { ethers } from "hardhat";

async function main() {
  const MockToken = await ethers.getContractFactory("MockERC20");
  const token = await MockToken.deploy("TestUSDC", "USDC", 6);

  await token.waitForDeployment();

  console.log("Mock USDC deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});