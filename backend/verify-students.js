// Simple Student Verification Script
// Usage: node verify-student-simple.js 0xSTUDENT_ADDRESS

const hre = require("hardhat");

async function main() {
  // Get student address from command line
  const studentAddress = process.argv[2];

  if (!studentAddress) {
    console.log("\n❌ Error: Please provide a student wallet address");
    console.log("\n📖 Usage:");
    console.log("   node verify-student-simple.js 0xSTUDENT_ADDRESS\n");
    console.log("📝 Example:");
    console.log("   node verify-student-simple.js 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb\n");
    process.exit(1);
  }

  // Validate address
  if (!studentAddress.startsWith("0x") || studentAddress.length !== 42) {
    console.log("\n❌ Error: Invalid Ethereum address format");
    console.log("   Address must start with 0x and be 42 characters long\n");
    process.exit(1);
  }

  console.log("\n🎓 Student Verification Tool");
  console.log("=" .repeat(50));
  console.log("");

  // Your contract address
  const CONTRACT_ADDRESS = "0x6A2c4F0A5faAe8594aa127861A14ebCd441906Cd";

  try {
    // Get admin signer
    const [admin] = await hre.ethers.getSigners();
    console.log("👨‍💼 Admin Wallet:", admin.address);
    console.log("🎓 Student to Verify:", studentAddress);
    console.log("");

    // Get contract instance
    const StudentLending = await hre.ethers.getContractAt(
      "StudentLending",
      CONTRACT_ADDRESS
    );

    // Check current status
    console.log("📋 Checking current verification status...");
    const currentStatus = await StudentLending.verifiedStudents(studentAddress);
    console.log("   Current Status:", currentStatus ? "✅ VERIFIED" : "❌ NOT VERIFIED");
    console.log("");

    if (currentStatus) {
      console.log("⚠️  This student is already verified!");
      console.log("   No action needed.\n");
      process.exit(0);
    }

    // Verify the student
    console.log("✍️  Submitting verification transaction...");
    const tx = await StudentLending.verifyStudent(studentAddress, true);
    
    console.log("⏳ Transaction Hash:", tx.hash);
    console.log("⏳ Waiting for confirmation (this takes ~15 seconds)...");
    console.log("");

    // Wait for transaction
    const receipt = await tx.wait();

    console.log("=" .repeat(50));
    console.log("✅ VERIFICATION SUCCESSFUL!");
    console.log("=" .repeat(50));
    console.log("");
    console.log("📝 Transaction Details:");
    console.log("   Hash:", receipt.hash);
    console.log("   Block:", receipt.blockNumber);
    console.log("   Gas Used:", receipt.gasUsed.toString());
    console.log("");
    console.log("🔗 View on Etherscan:");
    console.log("   https://sepolia.etherscan.io/tx/" + receipt.hash);
    console.log("");

    // Verify it worked
    const newStatus = await StudentLending.verifiedStudents(studentAddress);
    if (newStatus) {
      console.log("✅ Verification confirmed on blockchain!");
      console.log("");
      console.log("📧 Next Steps:");
      console.log("   1. Notify the student");
      console.log("   2. Student should refresh their dashboard");
      console.log("   3. Student will see '✓ Verified Student' badge");
      console.log("   4. Student can now apply for loans!");
      console.log("");
    } else {
      console.log("⚠️  Warning: Transaction succeeded but status not updated");
      console.log("   Please check Etherscan for details");
      console.log("");
    }

  } catch (error) {
    console.log("\n❌ ERROR:", error.message);
    console.log("\n🔍 Common issues:");
    console.log("   • Not enough Sepolia ETH for gas");
    console.log("   • Not using the admin/deployer wallet");
    console.log("   • Network connection issues");
    console.log("");
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n💥 Fatal Error:", error);
    process.exit(1);
  });