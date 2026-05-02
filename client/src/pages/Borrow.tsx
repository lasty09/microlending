import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Avatar,
  Chip,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import WarningIcon from "@mui/icons-material/Warning";
import SchoolIcon from "@mui/icons-material/School";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useState, useEffect } from "react";
import { parseUnits } from "viem";
import { sepolia } from "wagmi/chains";
import VerificationDialog from "../components/verificationDialog";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const GridItem = Grid as React.ElementType;

const CONTRACT_ADDRESS =
  "0x6A2c4F0A5faAe8594aa127861A14ebCd441906Cd" as `0x${string}`;
const DECIMALS = 2;
const MAX_LOAN_DISPLAY = 60000;

const ABI = [
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
    name: "borrow",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
] as const;

export default function Borrow() {
  const { address, isConnected, chain } = useAccount();
  const [borrowAmount, setBorrowAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  // Check verification status
  const { data: isVerifiedRaw, refetch: refetchVerified } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "verifiedStudents",
    args: [address!],
    query: { enabled: isConnected && !!address && chain?.id === sepolia.id },
  });

  const isVerified = isVerifiedRaw ?? false;

  // Check loan status
  const { data: loanData, refetch: refetchLoan } = useReadContract({
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

  // Write contract
  const {
    writeContract,
    data: txHash,
    isPending: isTxPending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  // Handle success
  useEffect(() => {
    if (isConfirmed) {
      refetchLoan();
      refetchVerified();
      setSuccessOpen(true);
      setBorrowAmount("");
      setPurpose("");
      resetWrite();
    }
  }, [isConfirmed]);

  const handleApplyForLoan = () => {
    // First check if wallet is connected
    if (!isConnected) {
      return; // ConnectButton will handle this
    }

    // Check network
    if (chain?.id !== sepolia.id) {
      alert("Please switch to Sepolia network");
      return;
    }

    // Check if verified
    if (!isVerified) {
      setVerificationOpen(true);
      return;
    }

    // Check if already has active loan
    if (hasActiveLoan) {
      alert("You already have an active loan. Please repay it first.");
      return;
    }

    // Validate amount
    if (
      !borrowAmount ||
      isNaN(Number(borrowAmount)) ||
      Number(borrowAmount) <= 0
    ) {
      alert("Please enter a valid amount");
      return;
    }

    if (Number(borrowAmount) > MAX_LOAN_DISPLAY) {
      alert(
        `Maximum loan amount is KSh ${MAX_LOAN_DISPLAY.toLocaleString("en-KE")}`
      );
      return;
    }

    // Submit borrow request
    const raw = parseUnits(borrowAmount, DECIMALS);
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "borrow",
      args: [raw],
    });
  };

  const isBusy = isTxPending || isConfirming;

  const repayAmount = borrowAmount
    ? Math.round(Number(borrowAmount) * 1.05).toLocaleString("en-KE")
    : "0";

  const dueDate = new Date(
    Date.now() + 140 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

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
            Apply for a Loan
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              maxWidth: "700px",
              mx: "auto",
              fontSize: { xs: "1rem", md: "1.25rem" },
              mb: 3,
            }}
          >
            Fast, low-interest loans for school fees, books, and living expenses
          </Typography>

          {/* Status Chips */}
          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            {isConnected ? (
              <>
                <Chip
                  label={isVerified ? "✓ Verified Student" : "Not Verified"}
                  icon={isVerified ? <VerifiedUserIcon /> : <WarningIcon />}
                  sx={{
                    px: 2,
                    py: 2.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    borderRadius: 10,
                    background: isVerified
                      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                      : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    color: "white",
                    boxShadow: isVerified
                      ? "0 4px 20px rgba(16, 185, 129, 0.3)"
                      : "0 4px 20px rgba(245, 158, 11, 0.3)",
                    "& .MuiChip-icon": { color: "white" },
                  }}
                />
                <Chip
                  label={`${address?.slice(0, 6)}...${address?.slice(-4)}`}
                  sx={{
                    px: 2,
                    py: 2.5,
                    fontSize: "1rem",
                    fontWeight: 500,
                    borderRadius: 10,
                    background: "rgba(249, 115, 22, 0.1)",
                    color: "#f97316",
                    border: "1px solid rgba(249, 115, 22, 0.3)",
                    backdropFilter: "blur(10px)",
                  }}
                />
              </>
            ) : (
              <Box sx={{ transform: "scale(1.1)" }}>
                <ConnectButton />
              </Box>
            )}
          </Box>
        </Box>

        {/* Network warning */}
        {isConnected && chain?.id !== sepolia.id && (
          <Alert
            severity="warning"
            sx={{
              mb: 4,
              maxWidth: 800,
              mx: "auto",
              borderRadius: 3,
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255, 152, 0, 0.1)",
              border: "1px solid rgba(255, 152, 0, 0.3)",
            }}
          >
            Please switch to Sepolia network in your wallet
          </Alert>
        )}

        {/* Verification warning */}
        {isConnected && !isVerified && chain?.id === sepolia.id && (
          <Alert
            severity="warning"
            sx={{
              mb: 4,
              maxWidth: 800,
              mx: "auto",
              borderRadius: 3,
              backgroundColor: "rgba(245, 158, 11, 0.1)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
            }}
          >
            <Typography variant="body2" gutterBottom fontWeight={600}>
              Verification Required
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              You need to be verified as a student before applying for a loan.
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => setVerificationOpen(true)}
              sx={{
                background:
                  "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                fontWeight: 600,
              }}
            >
              Request Verification
            </Button>
          </Alert>
        )}

        {/* Active loan warning */}
        {hasActiveLoan && (
          <Alert
            severity="info"
            sx={{
              mb: 4,
              maxWidth: 800,
              mx: "auto",
              borderRadius: 3,
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              border: "1px solid rgba(99, 102, 241, 0.3)",
            }}
          >
            You already have an active loan. Please repay it before applying for
            a new one.
          </Alert>
        )}

        {/* Error display */}
        {writeError && (
          <Alert
            severity="error"
            sx={{
              mb: 4,
              maxWidth: 800,
              mx: "auto",
              borderRadius: 3,
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            Transaction failed: {(writeError as Error).message?.split("\n")[0]}
          </Alert>
        )}

        <Grid container spacing={4} justifyContent="center">
          {/* Loan Application Form */}
          <GridItem xs={12} md={8}>
            <Card
              elevation={0}
              sx={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 4,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <Box display="flex" alignItems="center" gap={2} mb={4}>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(249, 115, 22, 0.2)",
                      width: 56,
                      height: 56,
                    }}
                  >
                    <SchoolIcon sx={{ fontSize: 32, color: "#f97316" }} />
                  </Avatar>
                  <Typography
                    variant="h5"
                    sx={{ color: "white", fontWeight: 700 }}
                  >
                    Loan Application
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  <GridItem xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Amount Needed (KSh)"
                      type="number"
                      variant="outlined"
                      placeholder="e.g. 15000"
                      value={borrowAmount}
                      onChange={(e) => setBorrowAmount(e.target.value)}
                      inputProps={{ min: 0, max: MAX_LOAN_DISPLAY, step: "1" }}
                      disabled={
                        isBusy || !isConnected || !isVerified || hasActiveLoan
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "white",
                          "& fieldset": {
                            borderColor: "rgba(249, 115, 22, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(249, 115, 22, 0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#f97316",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255,255,255,0.6)",
                        },
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Purpose"
                      variant="outlined"
                      placeholder="e.g. School fees, books"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      disabled={
                        isBusy || !isConnected || !isVerified || hasActiveLoan
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "white",
                          "& fieldset": {
                            borderColor: "rgba(249, 115, 22, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(249, 115, 22, 0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#f97316",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255,255,255,0.6)",
                        },
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12}>
                    <TextField
                      fullWidth
                      label="Repayment Period"
                      variant="outlined"
                      value="120 days + 20-day grace period (Fixed)"
                      disabled
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "rgba(255,255,255,0.7)",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.2)",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255,255,255,0.6)",
                        },
                      }}
                    />
                  </GridItem>
                </Grid>

                {borrowAmount && Number(borrowAmount) > 0 && (
                  <Alert
                    icon={<LocalAtmIcon />}
                    severity="info"
                    sx={{
                      mt: 3,
                      borderRadius: 3,
                      backgroundColor: "rgba(99, 102, 241, 0.1)",
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                    }}
                  >
                    <Typography variant="body2" gutterBottom fontWeight={600}>
                      Loan Summary
                    </Typography>
                    <Typography variant="body2">
                      • Borrow: KSh{" "}
                      {Number(borrowAmount).toLocaleString("en-KE")}
                    </Typography>
                    <Typography variant="body2">
                      • Interest (5%): KSh{" "}
                      {Math.round(Number(borrowAmount) * 0.05).toLocaleString(
                        "en-KE"
                      )}
                    </Typography>
                    <Typography variant="body2">
                      • Total Repayment: KSh {repayAmount}
                    </Typography>
                    <Typography variant="body2">• Due by: {dueDate}</Typography>
                  </Alert>
                )}

                <Box mt={5} textAlign="center">
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleApplyForLoan}
                    disabled={
                      isBusy ||
                      !isConnected ||
                      hasActiveLoan ||
                      chain?.id !== sepolia.id
                    }
                    sx={{
                      px: 8,
                      py: 2.5,
                      borderRadius: 3,
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      textTransform: "none",
                      background:
                        "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                      boxShadow: "0 4px 20px rgba(249, 115, 22, 0.4)",
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
                    {isBusy
                      ? isConfirming
                        ? "⏳ Confirming..."
                        : "⏳ Processing..."
                      : !isConnected
                        ? "🔒 Connect Wallet First"
                        : !isVerified
                          ? "⚠️ Request Verification First"
                          : hasActiveLoan
                            ? "✓ Active Loan Exists"
                            : "🎓 Apply for Loan"}
                  </Button>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.5)", mt: 2 }}
                  >
                    5% fixed interest • 120 days + 20-day grace period
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </GridItem>

          {/* Requirements Card */}
          <GridItem xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 4,
                height: "100%",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "white", fontWeight: 700, mb: 3 }}
                >
                  Loan Requirements
                </Typography>
                <List sx={{ p: 0 }}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: isVerified
                            ? "rgba(16, 185, 129, 0.2)"
                            : "rgba(245, 158, 11, 0.2)",
                          width: 40,
                          height: 40,
                        }}
                      >
                        {isVerified ? (
                          <VerifiedUserIcon sx={{ color: "#10b981" }} />
                        ) : (
                          <WarningIcon sx={{ color: "#f59e0b" }} />
                        )}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ color: "white", fontWeight: 600 }}>
                          Verified student account
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{
                            color: isVerified ? "#10b981" : "#f59e0b",
                            fontWeight: 500,
                          }}
                        >
                          {isVerified ? "✓ Verified" : "Not verified"}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor:
                            isConnected && chain?.id === sepolia.id
                              ? "rgba(16, 185, 129, 0.2)"
                              : "rgba(245, 158, 11, 0.2)",
                          width: 40,
                          height: 40,
                        }}
                      >
                        <SecurityIcon
                          sx={{
                            color:
                              isConnected && chain?.id === sepolia.id
                                ? "#10b981"
                                : "#f59e0b",
                          }}
                        />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ color: "white", fontWeight: 600 }}>
                          Wallet on Sepolia
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              isConnected && chain?.id === sepolia.id
                                ? "#10b981"
                                : "#f59e0b",
                            fontWeight: 500,
                          }}
                        >
                          {isConnected && chain?.id === sepolia.id
                            ? "✓ Connected"
                            : "Not connected"}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: "rgba(99, 102, 241, 0.2)",
                          width: 40,
                          height: 40,
                        }}
                      >
                        <SpeedIcon sx={{ color: "#6366f1" }} />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ color: "white", fontWeight: 600 }}>
                          No collateral needed
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255,255,255,0.6)",
                            fontWeight: 500,
                          }}
                        >
                          Just verification
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>

                {isConnected && !isVerified && (
                  <Box mt={3}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => setVerificationOpen(true)}
                      sx={{
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 600,
                        background:
                          "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                        boxShadow: "0 4px 16px rgba(245, 158, 11, 0.3)",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 20px rgba(245, 158, 11, 0.4)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Request Verification
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </GridItem>
        </Grid>

        {/* Info Section */}
        <Paper
          elevation={0}
          sx={{
            mt: 6,
            p: 4,
            background: "rgba(99, 102, 241, 0.1)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
            borderRadius: 4,
            backdropFilter: "blur(10px)",
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <GridItem xs={12} md={8}>
              <Typography variant="h6" sx={{ color: "white", fontWeight: 600, mb: 1 }}>
                💡 Quick Facts
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                • Maximum loan: KSh {MAX_LOAN_DISPLAY.toLocaleString("en-KE")} • Fixed 5% interest • 120-day term with 20-day grace • Instant disbursement • No prepayment penalties
              </Typography>
            </GridItem>
            <GridItem xs={12} md={4} textAlign={{ xs: "left", md: "right" }}>
              <Chip
                icon={<CheckCircleIcon />}
                label="Blockchain Secured"
                sx={{
                  px: 2,
                  py: 2.5,
                  bgcolor: "rgba(16, 185, 129, 0.2)",
                  color: "#10b981",
                  fontWeight: 600,
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  "& .MuiChip-icon": { color: "#10b981" },
                }}
              />
            </GridItem>
          </Grid>
        </Paper>
      </Container>

      {/* Verification Dialog */}
      <VerificationDialog
        open={verificationOpen}
        onClose={() => setVerificationOpen(false)}
        walletAddress={address ?? ""}
        isVerified={isVerified}
      />

      {/* Success Dialog */}
      <Dialog
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        maxWidth="sm"
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
          🎉 Loan Approved!
        </DialogTitle>
        <DialogContent>
          <Alert
            severity="success"
            sx={{
              mb: 2,
              borderRadius: 2,
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
            }}
          >
            Your loan has been successfully disbursed to your wallet!
          </Alert>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
            What's next?
          </Typography>
          <Box component="ul" sx={{ color: "rgba(255,255,255,0.7)", pl: 2 }}>
            <li>
              Your loan of KSh{" "}
              {borrowAmount ? Number(borrowAmount).toLocaleString("en-KE") : "0"} has
              been transferred
            </li>
            <li>Remember to repay KSh {repayAmount} by {dueDate}</li>
            <li>Check your dashboard to track repayment progress</li>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setSuccessOpen(false)}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              fontWeight: 600,
            }}
          >
            Got it!
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}