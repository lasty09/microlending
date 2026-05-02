import { expect } from "chai";
import { ethers } from "hardhat";
import { StudentLending } from "../typechain-types"; // Auto-generated types!

describe("StudentLending", function () {
  let lending: StudentLending;
  let token: any; // Mock token
  let owner: any, lender: any, student: any;

  beforeEach(async function () {
    [owner, lender, student] = await ethers.getSigners();

    // Deploy mock ERC20 (you'll need a MockERC20.sol for this)
    const MockToken = await ethers.getContractFactory("MockERC20");
    token = await MockToken.deploy("TestUSDC", "USDC", 6);

    await token.mint(lender.address, ethers.parseUnits("10000", 6));

    const StudentLending = await ethers.getContractFactory("StudentLending");
    lending = (await StudentLending.deploy(
      token.target
    )) as unknown as StudentLending;
  });

  it("Should allow deposit, verify, and borrow", async function () {
    // Deposit
    await token
      .connect(lender)
      .approve(lending.target, ethers.parseUnits("1000", 6));
    await lending.connect(lender).deposit(ethers.parseUnits("1000", 6));

    // Verify student
    await lending.verifyStudent(student.address, true);

    // Borrow
    await lending.connect(student).borrow(ethers.parseUnits("200", 6));

    const loan = await lending.getLoanDetails(student.address);
    expect(loan.principal).to.equal(ethers.parseUnits("200", 6));
    expect(loan.repayAmount).to.equal(ethers.parseUnits("210", 6)); // 200 + 5%
  });
});
