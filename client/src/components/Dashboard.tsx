import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  LinearProgress,
  Avatar,
  Skeleton,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Paper,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import WarningIcon from "@mui/icons-material/Warning";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SecurityIcon from "@mui/icons-material/Security";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { useState, useEffect } from "react";
import { maxUint256 } from "viem";
import { sepolia } from "wagmi/chains";
import VerificationDialog from "../components/verificationDialog";

const GridItem = Grid as React.ElementType;

// Constants
const CONTRACT_ADDRESS =
  "0x6A2c4F0A5faAe8594aa127861A14ebCd441906Cd" as `0x${string}`;
const TOKEN_ADDRESS =
  "0x91E4eBe667fac488efE1eEd352314f127794835D" as `0x${string}`;

const DECIMALS = 2;
const MAX_LOAN_DISPLAY = 60000;

// ABIs
const ABI = [
  {
    name: "totalDeposited",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "verifiedStudents",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "getLoanDetails",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "borrower", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "principal", type: "uint256" },
          { name: "startTime", type: "uint256" },
          { name: "repayAmount", type: "uint256" },
          { name: "active", type: "bool" },
          { name: "repaid", type: "bool" },
        ],
      },
    ],
  },
  {
    name: "isOverdue",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "borrower", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "deposit",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    name: "borrow",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    name: "repay",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
] as const;

const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export default function Dashboard() {
  const theme = useTheme();
  const { address, isConnected, chain } = useAccount();

  // State
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [borrowOpen, setBorrowOpen] = useState(false);
  const [borrowAmount, setBorrowAmount] = useState("");
  const [verificationOpen, setVerificationOpen] = useState(false);

  const [toast, setToast] = useState<{
    open: boolean;
    msg: string;
    severity: "success" | "error";
  }>({
    open: false,
    msg: "",
    severity: "success",
  });

  const showToast = (msg: string, severity: "success" | "error" = "success") =>
    setToast({ open: true, msg, severity });

  // Contract Reads
  const {
    data: totalRaw,
    isLoading: isLoadingPool,
    error: poolError,
    refetch: refetchPool,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "totalDeposited",
    query: { enabled: isConnected && chain?.id === sepolia.id },
  });

  const totalFormatted =
    totalRaw !== undefined
      ? Number(formatUnits(totalRaw, DECIMALS)).toLocaleString("en-KE")
      : "0";

  const {
    data: isVerifiedRaw,
    isLoading: isLoadingVerified,
    refetch: refetchVerified,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "verifiedStudents",
    args: [address!],
    query: { enabled: isConnected && !!address && chain?.id === sepolia.id },
  });

  const isVerified = isVerifiedRaw ?? false;

  const {
    data: loanData,
    isLoading: isLoadingLoan,
    refetch: refetchLoan,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "getLoanDetails",
    args: [address!],
    query: { enabled: isConnected && !!address && chain?.id === sepolia.id },
  });

  const userLoan = loanData as
    | {
        principal: bigint;
        startTime: bigint;
        repayAmount: bigint;
        active: boolean;
        repaid: boolean;
      }
    | undefined;

  const hasActiveLoan = userLoan?.active && !userLoan?.repaid;

  const { data: isOverdue } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "isOverdue",
    args: [address!],
    query: {
      enabled:
        isConnected && !!address && chain?.id === sepolia.id && hasActiveLoan,
    },
  });

  const { data: tokenBalanceRaw, refetch: refetchBalance } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address!],
    query: { enabled: isConnected && !!address && chain?.id === sepolia.id },
  });

  const formattedBalance = tokenBalanceRaw
    ? Number(formatUnits(tokenBalanceRaw, DECIMALS)).toLocaleString("en-KE")
    : "0";

  const { data: depositAllowance, refetch: refetchDepositAllowance } =
    useReadContract({
      address: TOKEN_ADDRESS,
      abi: ERC20_ABI,
      functionName: "allowance",
      args: [address!, CONTRACT_ADDRESS],
      query: {
        enabled:
          isConnected && !!address && depositOpen && chain?.id === sepolia.id,
      },
    });

  const { data: repayAllowance, refetch: refetchRepayAllowance } =
    useReadContract({
      address: TOKEN_ADDRESS,
      abi: ERC20_ABI,
      functionName: "allowance",
      args: [address!, CONTRACT_ADDRESS],
      query: {
        enabled:
          isConnected && !!address && hasActiveLoan && chain?.id === sepolia.id,
      },
    });

  // Writes
  const {
    writeContract,
    data: txHash,
    isPending: isTxPending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const [pendingAction, setPendingAction] = useState<
    "deposit" | "borrow" | "repay" | "approve_deposit" | "approve_repay" | null
  >(null);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  useEffect(() => {
    if (isConfirmed) {
      refetchPool();
      refetchLoan();
      refetchVerified();
      refetchBalance();

      const msgs: Record<string, string> = {
        deposit: "Deposit confirmed!",
        borrow: "Loan disbursed!",
        repay: "Loan repaid successfully!",
        approve_deposit: "Approval confirmed! Now deposit.",
        approve_repay: "Approval confirmed! Now repay.",
      };
      showToast(msgs[pendingAction ?? ""] ?? "Transaction confirmed!");

      if (pendingAction === "approve_deposit") {
        refetchDepositAllowance();
      }
      if (pendingAction === "approve_repay") {
        refetchRepayAllowance();
      }

      if (!pendingAction?.startsWith("approve_")) {
        setDepositAmount("");
        setBorrowAmount("");
        setDepositOpen(false);
        setBorrowOpen(false);
      }

      setPendingAction(null);
      resetWrite();
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (writeError) {
      const msg =
        (writeError as Error).message?.split("\n")[0] ?? "Transaction failed";
      showToast(msg, "error");
      setPendingAction(null);
    }
  }, [writeError]);

  // Handlers
  const handleApproveDeposit = () => {
    setPendingAction("approve_deposit");
    writeContract({
      address: TOKEN_ADDRESS,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [CONTRACT_ADDRESS, maxUint256],
    });
  };

  const handleApproveRepay = () => {
    setPendingAction("approve_repay");
    writeContract({
      address: TOKEN_ADDRESS,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [CONTRACT_ADDRESS, maxUint256],
    });
  };

  const handleDeposit = () => {
    if (
      !depositAmount ||
      isNaN(Number(depositAmount)) ||
      Number(depositAmount) <= 0
    ) {
      showToast("Enter a valid amount", "error");
      return;
    }
    const raw = parseUnits(depositAmount, DECIMALS);

    if (!depositAllowance || depositAllowance < raw) {
      showToast("Token approval required first", "error");
      return;
    }

    setPendingAction("deposit");
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "deposit",
      args: [raw],
    });
  };

  const handleBorrow = () => {
    if (
      !borrowAmount ||
      isNaN(Number(borrowAmount)) ||
      Number(borrowAmount) <= 0
    ) {
      showToast("Enter a valid amount", "error");
      return;
    }
    if (Number(borrowAmount) > MAX_LOAN_DISPLAY) {
      showToast(
        `Max loan is KSh ${MAX_LOAN_DISPLAY.toLocaleString("en-KE")}`,
        "error",
      );
      return;
    }
    const raw = parseUnits(borrowAmount, DECIMALS);
    setPendingAction("borrow");
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "borrow",
      args: [raw],
    });
  };

  const handleRepay = () => {
    if (!userLoan?.repayAmount) return;

    if (!repayAllowance || repayAllowance < userLoan.repayAmount) {
      showToast("Token approval required first", "error");
      return;
    }

    setPendingAction("repay");
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "repay",
    });
  };

  // Derived values
  const isBusy = isTxPending || isConfirming;

  const depositAmountRaw = depositAmount
    ? parseUnits(depositAmount, DECIMALS)
    : 0n;
  const needsDepositApproval =
    !depositAllowance || depositAllowance < depositAmountRaw;

  const needsRepayApproval =
    userLoan?.repayAmount && repayAllowance
      ? repayAllowance < userLoan.repayAmount
      : true;

  const loanPrincipal = userLoan
    ? Number(formatUnits(userLoan.principal, DECIMALS))
    : 0;
  const loanRepay = userLoan
    ? Number(formatUnits(userLoan.repayAmount, DECIMALS))
    : 0;

  const dueDateMs = userLoan?.startTime
    ? Number(userLoan.startTime) * 1000 + (120 + 20) * 24 * 60 * 60 * 1000
    : null;

  const dueDateStr = dueDateMs
    ? new Date(dueDateMs).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  const repaidPercent = hasActiveLoan ? 0 : userLoan?.repaid ? 100 : 0;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        pt: 4,
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Network Check */}
        {isConnected && chain?.id !== sepolia.id && (
          <Alert
            severity="warning"
            sx={{
              mb: 4,
              borderRadius: 3,
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255, 152, 0, 0.1)",
              border: "1px solid rgba(255, 152, 0, 0.3)",
            }}
          >
            Please switch to Sepolia network in your wallet
          </Alert>
        )}

        {/* Hero Section */}
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
            }}
          >
            Welcome to MicroLend
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              fontWeight: 400,
              mb: 3,
              fontSize: { xs: "1rem", md: "1.25rem" },
            }}
          >
            Secure, low-interest loans for Kenyan students
          </Typography>

          {/* Verification Badge */}
          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            {isLoadingVerified ? (
              <Skeleton
                variant="rounded"
                width={200}
                height={44}
                sx={{ borderRadius: 10 }}
              />
            ) : (
              <Chip
                label={isVerified ? "✓ Verified Student" : "Not Verified"}
                icon={isVerified ? <VerifiedUserIcon /> : <WarningIcon />}
                sx={{
                  px: 3,
                  py: 2.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 10,
                  background: isVerified
                    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  color: "white",
                  border: "none",
                  boxShadow: isVerified
                    ? "0 8px 20px rgba(16, 185, 129, 0.3)"
                    : "0 8px 20px rgba(245, 158, 11, 0.3)",
                  "& .MuiChip-icon": { color: "white" },
                }}
              />
            )}
            {isConnected && (
              <Chip
                label={`${address?.slice(0, 6)}...${address?.slice(-4)}`}
                icon={<AccountBalanceWalletIcon />}
                sx={{
                  px: 3,
                  py: 2.5,
                  fontSize: "1rem",
                  fontWeight: 500,
                  borderRadius: 10,
                  background: "rgba(249, 115, 22, 0.1)",
                  color: "#f97316",
                  border: "1px solid rgba(249, 115, 22, 0.3)",
                  backdropFilter: "blur(10px)",
                  "& .MuiChip-icon": { color: "#f97316" },
                }}
              />
            )}
          </Box>
        </Box>

        {/* Stats Cards Row */}
        <Grid container spacing={3} mb={4}>
          {/* Total Pool */}
          <GridItem xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                borderRadius: 4,
                boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "100px",
                  height: "100px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                  transform: "translate(30%, -30%)",
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    width: 56,
                    height: 56,
                  }}
                >
                  <TrendingUpIcon sx={{ fontSize: 32, color: "white" }} />
                </Avatar>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 500 }}
                  >
                    Platform Pool
                  </Typography>
                  {isLoadingPool ? (
                    <Skeleton
                      variant="text"
                      width={120}
                      height={40}
                      sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
                    />
                  ) : (
                    <Typography
                      variant="h4"
                      sx={{ color: "white", fontWeight: 700 }}
                    >
                      KSh {totalFormatted}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.7)" }}
              >
                Available for loans
              </Typography>
            </Paper>
          </GridItem>

          {/* Your Balance */}
          <GridItem xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                borderRadius: 4,
                boxShadow: "0 8px 32px rgba(249, 115, 22, 0.3)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "100px",
                  height: "100px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                  transform: "translate(30%, -30%)",
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    width: 56,
                    height: 56,
                  }}
                >
                  <LocalAtmIcon sx={{ fontSize: 32, color: "white" }} />
                </Avatar>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 500 }}
                  >
                    Your Balance
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: "white", fontWeight: 700 }}
                  >
                    KSh {formattedBalance}
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.7)" }}
              >
                Token balance
              </Typography>
            </Paper>
          </GridItem>

          {/* Max Loan */}
          <GridItem xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                borderRadius: 4,
                boxShadow: "0 8px 32px rgba(16, 185, 129, 0.3)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "100px",
                  height: "100px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                  transform: "translate(30%, -30%)",
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    width: 56,
                    height: 56,
                  }}
                >
                  <SecurityIcon sx={{ fontSize: 32, color: "white" }} />
                </Avatar>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 500 }}
                  >
                    Max Loan
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: "white", fontWeight: 700 }}
                  >
                    KSh {MAX_LOAN_DISPLAY.toLocaleString("en-KE")}
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.7)" }}
              >
                5% fixed interest • 120 days
              </Typography>
            </Paper>
          </GridItem>
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Loan Status Card */}
          <GridItem xs={12} md={8}>
            <Card
              elevation={0}
              sx={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 4,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                overflow: "hidden",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    color: "white",
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <AccessTimeIcon sx={{ color: "#f97316" }} />
                  Your Activity
                </Typography>

                {isLoadingLoan ? (
                  <Box>
                    <Skeleton
                      variant="text"
                      width="50%"
                      height={40}
                      sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
                    />
                    <Skeleton
                      variant="text"
                      width="70%"
                      sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
                    />
                    <Skeleton
                      variant="rectangular"
                      height={10}
                      sx={{ mt: 2, borderRadius: 5, bgcolor: "rgba(255,255,255,0.1)" }}
                    />
                  </Box>
                ) : hasActiveLoan ? (
                  <Box>
                    <Box
                      sx={{
                        p: 3,
                        background: "rgba(249, 115, 22, 0.1)",
                        borderRadius: 3,
                        border: "1px solid rgba(249, 115, 22, 0.2)",
                        mb: 3,
                      }}
                    >
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 600 }}
                      >
                        Active Loan
                      </Typography>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 800,
                          color: "#f97316",
                          mb: 1,
                        }}
                      >
                        KSh {loanPrincipal.toLocaleString("en-KE")}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        Total to repay: KSh {loanRepay.toLocaleString("en-KE")}{" "}
                        (incl. 5% interest)
                      </Typography>
                    </Box>

                    {isOverdue && (
                      <Alert
                        severity="error"
                        sx={{
                          mb: 2,
                          borderRadius: 2,
                          backgroundColor: "rgba(239, 68, 68, 0.1)",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                        }}
                      >
                        This loan is overdue!
                      </Alert>
                    )}

                    <Box mb={3}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        mb={1}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255,255,255,0.6)" }}
                        >
                          Repayment Progress
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#f97316", fontWeight: 600 }}
                        >
                          {repaidPercent}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={repaidPercent}
                        sx={{
                          height: 12,
                          borderRadius: 10,
                          backgroundColor: "rgba(255,255,255,0.1)",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 10,
                            background:
                              "linear-gradient(90deg, #f97316 0%, #fb923c 100%)",
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255,255,255,0.5)", mt: 1, display: "block" }}
                      >
                        Due: {dueDateStr}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={needsRepayApproval ? handleApproveRepay : handleRepay}
                      disabled={
                        isBusy &&
                        (pendingAction === "repay" ||
                          pendingAction === "approve_repay")
                      }
                      sx={{
                        py: 2,
                        borderRadius: 3,
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        textTransform: "none",
                        background: needsRepayApproval
                          ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                          : "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                        boxShadow: needsRepayApproval
                          ? "0 4px 20px rgba(245, 158, 11, 0.4)"
                          : "0 4px 20px rgba(249, 115, 22, 0.4)",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: needsRepayApproval
                            ? "0 6px 24px rgba(245, 158, 11, 0.5)"
                            : "0 6px 24px rgba(249, 115, 22, 0.5)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isBusy && pendingAction === "approve_repay"
                        ? "Approving..."
                        : isBusy && pendingAction === "repay"
                          ? "Repaying..."
                          : needsRepayApproval
                            ? "Step 1: Approve Tokens"
                            : "Repay Now"}
                    </Button>
                  </Box>
                ) : userLoan?.repaid ? (
                  <Alert
                    icon={<CheckCircleIcon />}
                    severity="success"
                    sx={{
                      borderRadius: 3,
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      "& .MuiAlert-icon": { color: "#10b981" },
                    }}
                  >
                    Your previous loan has been fully repaid. You can apply for
                    a new one!
                  </Alert>
                ) : (
                  <Box textAlign="center" py={4}>
                    <Typography
                      variant="body1"
                      sx={{ color: "rgba(255,255,255,0.5)", mb: 3 }}
                    >
                      No activity yet. Start by depositing to the pool or
                      applying for a loan.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </GridItem>

          {/* Action Buttons */}
          <GridItem xs={12} md={4}>
            <Box display="flex" flexDirection="column" gap={3} height="100%">
              {/* Deposit Button */}
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => setDepositOpen(true)}
                disabled={!isConnected || isBusy || chain?.id !== sepolia.id}
                sx={{
                  py: 3,
                  borderRadius: 4,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  textTransform: "none",
                  background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                  boxShadow: "0 4px 20px rgba(99, 102, 241, 0.4)",
                  flex: 1,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 24px rgba(99, 102, 241, 0.5)",
                  },
                  "&:disabled": {
                    background: "rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.3)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                💰 Deposit to Pool
              </Button>

              {/* Borrow Button */}
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => setBorrowOpen(true)}
                disabled={
                  !isConnected ||
                  !isVerified ||
                  hasActiveLoan ||
                  isBusy ||
                  chain?.id !== sepolia.id
                }
                sx={{
                  py: 3,
                  borderRadius: 4,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  textTransform: "none",
                  background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                  boxShadow: "0 4px 20px rgba(249, 115, 22, 0.4)",
                  flex: 1,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 24px rgba(249, 115, 22, 0.5)",
                  },
                  "&:disabled": {
                    background: "rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.3)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {!isConnected
                  ? "🔒 Connect Wallet"
                  : !isVerified
                    ? "⚠️ Verification Required"
                    : hasActiveLoan
                      ? "✓ Loan Active"
                      : "🎓 Apply for Loan"}
              </Button>

              {/* Verification Button */}
              {!isVerified && isConnected && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    background: "rgba(245, 158, 11, 0.1)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    borderRadius: 4,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.7)", mb: 2 }}
                  >
                    To borrow, you need to verify your student status
                  </Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setVerificationOpen(true)}
                    sx={{
                      borderColor: "#f59e0b",
                      color: "#f59e0b",
                      fontWeight: 600,
                      borderRadius: 3,
                      py: 1.5,
                      "&:hover": {
                        borderColor: "#d97706",
                        backgroundColor: "rgba(245, 158, 11, 0.1)",
                      },
                    }}
                  >
                    Request Verification
                  </Button>
                </Paper>
              )}
            </Box>
          </GridItem>
        </Grid>

        {/* Footer */}
        <Box textAlign="center" mt={8}>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.5)", mb: 1 }}
          >
            🔒 Secured by Blockchain (Sepolia Testnet)
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
            5% fixed interest • No hidden fees • Student-focused lending
          </Typography>
        </Box>
      </Container>

      {/* Deposit Dialog */}
      <Dialog
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            borderRadius: 4,
            border: "1px solid rgba(249, 115, 22, 0.2)",
          },
        }}
      >
        <DialogTitle sx={{ color: "white", fontWeight: 700, fontSize: "1.5rem" }}>
          Deposit to Pool
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mb: 2 }}>
            Enter the amount of lending tokens to deposit.
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", mb: 2 }}>
            Your balance: KSh {formattedBalance}
          </Typography>
          <TextField
            label="Amount (KSh)"
            type="number"
            fullWidth
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            inputProps={{ min: 0, step: "1" }}
            autoFocus
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "rgba(249, 115, 22, 0.3)" },
                "&:hover fieldset": { borderColor: "rgba(249, 115, 22, 0.5)" },
                "&.Mui-focused fieldset": { borderColor: "#f97316" },
              },
              "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
            }}
          />
          {depositAmount && needsDepositApproval && (
            <Alert
              severity="warning"
              sx={{
                mt: 2,
                borderRadius: 2,
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
              }}
            >
              You need to approve token spending first (one-time step).
            </Alert>
          )}
          {depositAmount && !needsDepositApproval && (
            <Alert
              severity="success"
              sx={{
                mt: 2,
                borderRadius: 2,
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}
            >
              ✅ Token approval sufficient. Ready to deposit!
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setDepositOpen(false)}
            disabled={isBusy}
            sx={{ color: "rgba(255,255,255,0.6)" }}
          >
            Cancel
          </Button>
          {needsDepositApproval && depositAmount ? (
            <Button
              variant="contained"
              onClick={handleApproveDeposit}
              disabled={isBusy || !depositAmount}
              sx={{
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                fontWeight: 600,
              }}
            >
              {isBusy && pendingAction === "approve_deposit"
                ? isConfirming
                  ? "Confirming..."
                  : "Approving..."
                : "Approve Tokens"}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleDeposit}
              disabled={isBusy || !depositAmount}
              sx={{
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                fontWeight: 600,
              }}
            >
              {isBusy && pendingAction === "deposit"
                ? isConfirming
                  ? "Confirming..."
                  : "Waiting..."
                : "Deposit"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Borrow Dialog */}
      <Dialog
        open={borrowOpen}
        onClose={() => setBorrowOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            borderRadius: 4,
            border: "1px solid rgba(249, 115, 22, 0.2)",
          },
        }}
      >
        <DialogTitle sx={{ color: "white", fontWeight: 700, fontSize: "1.5rem" }}>
          Apply for Loan
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mb: 2 }}>
            Enter the amount you want to borrow (max KSh{" "}
            {MAX_LOAN_DISPLAY.toLocaleString("en-KE")}). You will repay{" "}
            {borrowAmount
              ? `KSh ${Math.round(Number(borrowAmount) * 1.05).toLocaleString("en-KE")}`
              : "principal + 5%"}{" "}
            within 120 days + 20-day grace period.
          </Typography>
          <TextField
            label={`Amount (KSh, max ${MAX_LOAN_DISPLAY.toLocaleString("en-KE")})`}
            type="number"
            fullWidth
            value={borrowAmount}
            onChange={(e) => setBorrowAmount(e.target.value)}
            inputProps={{ min: 0, max: MAX_LOAN_DISPLAY, step: "1" }}
            autoFocus
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "rgba(249, 115, 22, 0.3)" },
                "&:hover fieldset": { borderColor: "rgba(249, 115, 22, 0.5)" },
                "&.Mui-focused fieldset": { borderColor: "#f97316" },
              },
              "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
            }}
          />
          {borrowAmount && (
            <Alert
              severity="info"
              sx={{
                mt: 2,
                borderRadius: 2,
                backgroundColor: "rgba(99, 102, 241, 0.1)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
              }}
            >
              You will repay KSh{" "}
              {Math.round(Number(borrowAmount) * 1.05).toLocaleString("en-KE")}{" "}
              by{" "}
              {new Date(
                Date.now() + 140 * 24 * 60 * 60 * 1000,
              ).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setBorrowOpen(false)}
            disabled={isBusy}
            sx={{ color: "rgba(255,255,255,0.6)" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleBorrow}
            disabled={isBusy}
            sx={{
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              fontWeight: 600,
            }}
          >
            {isBusy && pendingAction === "borrow"
              ? isConfirming
                ? "Confirming..."
                : "Waiting..."
              : "Borrow"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Verification Dialog */}
      <VerificationDialog
        open={verificationOpen}
        onClose={() => setVerificationOpen(false)}
        walletAddress={address ?? ""}
        isVerified={isVerified}
      />

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          sx={{
            width: "100%",
            borderRadius: 3,
            fontWeight: 600,
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}