// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract StudentLending is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable lendingToken;

    uint256 public constant FIXED_INTEREST_RATE = 5; // 5% simple interest
    uint256 public constant MAX_LOAN_AMOUNT = 6000 * 10 ** 6; // $500 (6 decimals like USDC)
    uint256 public constant LOAN_DURATION = 120 days;
    uint256 public constant GRACE_PERIOD = 20 days;

    uint256 public totalDeposited;

    struct Loan {
        uint256 principal;
        uint256 startTime;
        uint256 repayAmount;
        bool active;
        bool repaid;
    }

    mapping(address => bool) public verifiedStudents;
    mapping(address => Loan) public loans;

    event Deposited(address indexed lender, uint256 amount);
    event Borrowed(
        address indexed borrower,
        uint256 principal,
        uint256 repayAmount
    );
    event Repaid(address indexed borrower, uint256 amount);
    event StudentVerified(address indexed student, bool status);

    constructor(address _lendingToken) Ownable(msg.sender) {
        require(_lendingToken != address(0), "Invalid token address");
        lendingToken = IERC20(_lendingToken);
    }

    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        lendingToken.safeTransferFrom(msg.sender, address(this), amount);
        totalDeposited += amount;
        emit Deposited(msg.sender, amount);
    }

    function verifyStudent(address student, bool status) external onlyOwner {
        verifiedStudents[student] = status;
        emit StudentVerified(student, status);
    }

    function borrow(uint256 amount) external nonReentrant {
        require(verifiedStudents[msg.sender], "Student not verified");
        require(amount > 0 && amount <= MAX_LOAN_AMOUNT, "Invalid amount");
        require(totalDeposited >= amount, "Insufficient liquidity");

        Loan storage loan = loans[msg.sender];
        require(!loan.active || loan.repaid, "Existing active loan");

        uint256 interest = (amount * FIXED_INTEREST_RATE) / 100;
        uint256 repayAmount = amount + interest;

        loan.principal = amount;
        loan.startTime = block.timestamp;
        loan.repayAmount = repayAmount;
        loan.active = true;
        loan.repaid = false;

        totalDeposited -= amount;

        lendingToken.safeTransfer(msg.sender, amount);

        emit Borrowed(msg.sender, amount, repayAmount);
    }

    function repay() external nonReentrant {
        Loan storage loan = loans[msg.sender];
        require(loan.active && !loan.repaid, "No active loan");

        uint256 dueAmount = loan.repayAmount;

        lendingToken.safeTransferFrom(msg.sender, address(this), dueAmount);

        loan.repaid = true;
        loan.active = false;
        totalDeposited += dueAmount;

        emit Repaid(msg.sender, dueAmount);
    }

    function getLoanDetails(
        address borrower
    ) external view returns (Loan memory) {
        return loans[borrower];
    }

    function isOverdue(address borrower) external view returns (bool) {
        Loan memory loan = loans[borrower];
        if (!loan.active || loan.repaid) return false;
        return block.timestamp > loan.startTime + LOAN_DURATION + GRACE_PERIOD;
    }

    // For prototype cleanup
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        lendingToken.safeTransfer(owner(), amount);
        totalDeposited -= amount;
    }
}
