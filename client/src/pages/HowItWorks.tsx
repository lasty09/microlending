import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SecurityIcon from "@mui/icons-material/Security";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SchoolIcon from "@mui/icons-material/School";
import { useState } from "react";

const GridItem = Grid as React.ElementType;

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const studentSteps = [
    {
      label: "Connect Your Wallet",
      icon: <AccountBalanceWalletIcon />,
      description:
        "Connect your MetaMask or any Web3 wallet to the platform.\n\n Make sure you're on the Sepolia testnet.",
      details: [
        "Install MetaMask browser extension",
        "Create or import a wallet",
        "Switch to Sepolia testnet",
        "Click 'Connect Wallet' on our platform",
      ],
    },
    {
      label: "Get Verified as a Student",
      icon: <VerifiedUserIcon />,
      description:
        "Submit your student ID and institution details for verification. This is a one-time process.",
      details: [
        "Click 'Request Verification' button",
        "Upload your student ID or enrollment letter",
        "Fill in student ID and institution name",
        "Share your wallet address with admin",
        "Wait for admin approval (usually within 24 hours)",
      ],
    },
    {
      label: "Apply for a Loan",
      icon: <LocalAtmIcon />,
      description:
        "Once verified, you can apply for loans up to KSh 60,000 at 5% fixed interest.",
      details: [
        "Navigate to Dashboard or Borrow page",
        "Click 'Apply for Loan' button",
        "Enter the amount you need (max KSh 60,000)",
        "Specify purpose (e.g., school fees, books)",
        "Confirm the transaction in your wallet",
        "Loan funds are instantly transferred!",
      ],
    },
    {
      label: "Repay Your Loan",
      icon: <CheckCircleIcon />,
      description:
        "Repay your loan within 120 days plus a 20-day grace period. Track progress on your dashboard.",
      details: [
        "Make sure you have enough tokens in your wallet",
        "Go to your Dashboard to see active loan",
        "Click 'Step 1: Approve Tokens' (one-time)",
        "Then click 'Repay Now' button",
        "Full repayment is made in one transaction",
        "Build your credit history on-chain!",
      ],
    },
  ];

  const lenderSteps = [
    {
      label: "Connect & Deposit",
      icon: <AccountBalanceWalletIcon />,
      description:
        "Connect your wallet and deposit lending tokens to the pool to start earning interest.",
    },
    {
      label: "Earn 5% Interest",
      icon: <TrendingUpIcon />,
      description:
        "Your deposited funds are used for student loans and earn you a fixed 5% return.",
    },
    {
      label: "Withdraw Anytime",
      icon: <LocalAtmIcon />,
      description:
        "Withdraw your principal plus interest whenever you want (subject to liquidity).",
    },
  ];

  const features = [
    {
      icon: <SecurityIcon />,
      title: "Blockchain Secured",
      description:
        "All transactions are recorded on the Ethereum blockchain, ensuring transparency and immutability.",
      gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    },
    {
      icon: <TrendingUpIcon />,
      title: "Fixed 5% Interest",
      description:
        "Simple, transparent pricing. No hidden fees, no variable rates. Just a straightforward 5% annual interest.",
      gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    },
    {
      icon: <AccessTimeIcon />,
      title: "Flexible Terms",
      description:
        "120-day loan term with an additional 20-day grace period. Repay early without penalties.",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    {
      icon: <SchoolIcon />,
      title: "Student-Focused",
      description:
        "Designed specifically for Kenyan students. No collateral required, just student verification.",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    },
  ];

  const faqs = [
    {
      question: "What is MicroLend?",
      answer:
        "MicroLend is a decentralized lending platform built on the Ethereum blockchain, specifically designed to provide affordable micro-loans to verified students in Kenya. The platform connects lenders with students who need financial support for education-related expenses.",
    },
    {
      question: "How does the verification process work?",
      answer:
        "Students submit their student ID and institution details through the platform. The information is stored locally in your browser, and you share your wallet address with our admin team. Once verified by the admin on-chain, you can immediately start borrowing. This verification is permanent and only needs to be done once.",
    },
    {
      question: "What can I use the loan for?",
      answer:
        "Loans can be used for any education-related expenses including tuition fees, books, accommodation, living expenses, or any other student needs. We trust verified students to use funds responsibly.",
    },
    {
      question: "How much can I borrow?",
      answer:
        "Verified students can borrow up to KSh 60,000 (approximately $500) per loan. You can only have one active loan at a time. Once you fully repay a loan, you can apply for another one.",
    },
    {
      question: "What are the interest rates and fees?",
      answer:
        "We charge a simple 5% fixed interest rate on the principal amount. There are no hidden fees, no origination fees, and no prepayment penalties. If you borrow KSh 10,000, you'll repay exactly KSh 10,500.",
    },
    {
      question: "What happens if I can't repay on time?",
      answer:
        "You have 120 days to repay your loan, plus an additional 20-day grace period (total 140 days). While we don't currently have late fees, your loan will be marked as overdue on-chain. We encourage students to communicate early if they're facing difficulties.",
    },
    {
      question: "Is my data safe?",
      answer:
        "Your verification documents are stored locally in your browser and are never sent to a centralized server. Only your wallet address and verification status are recorded on the blockchain. The smart contract code is open source and auditable.",
    },
    {
      question: "How do I get test tokens on Sepolia?",
      answer:
        "For demo purposes on Sepolia testnet: 1) Get Sepolia ETH from faucets like sepoliafaucet.com, 2) Contact our admin to receive test USDC tokens for borrowing/lending demonstrations.",
    },
    {
      question: "Can I be both a lender and a borrower?",
      answer:
        "Yes! You can deposit funds to earn interest as a lender. However, to borrow, you must be a verified student. These actions can be done from the same wallet address.",
    },
    {
      question: "What blockchain is this built on?",
      answer:
        "MicroLend is built on Ethereum and currently deployed on the Sepolia testnet for demonstration. The smart contracts use OpenZeppelin's security standards and are written in Solidity 0.8.20.",
    },
  ];

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
        <Box textAlign="center" mb={8}>
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
            How It Works
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              maxWidth: "800px",
              mx: "auto",
              fontSize: { xs: "1rem", md: "1.25rem" },
            }}
          >
            Simple, transparent, and secure micro-lending for students.
            Get started in just a few steps.
          </Typography>
        </Box>

        {/* For Students Section */}
        <Box mb={8}>
          <Box display="flex" alignItems="center" gap={2} mb={4}>
            <Avatar
              sx={{
                bgcolor: "#f97316",
                width: 56,
                height: 56,
              }}
            >
              <SchoolIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography
              variant="h4"
              sx={{
                color: "white",
                fontWeight: 700,
              }}
            >
              For Students (Borrowers)
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {studentSteps.map((step, index) => (
              <GridItem xs={12} sm={6} md={6} lg={6} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 4,
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 32px rgba(249, 115, 22, 0.2)",
                      border: "1px solid rgba(249, 115, 22, 0.3)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Avatar
                        sx={{
                          bgcolor: "rgba(249, 115, 22, 0.2)",
                          color: "#f97316",
                          width: 48,
                          height: 48,
                        }}
                      >
                        {step.icon}
                      </Avatar>
                      <Box>
                        <Chip
                          label={`Step ${index + 1}`}
                          size="small"
                          sx={{
                            bgcolor: "rgba(249, 115, 22, 0.2)",
                            color: "#f97316",
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        />
                        <Typography
                          variant="h6"
                          sx={{ color: "white", fontWeight: 700 }}
                        >
                          {step.label}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 2 }}
                    >
                      {step.description}
                    </Typography>
                    {step.details && (
                      <Box
                        component="ul"
                        sx={{
                          pl: 2,
                          m: 0,
                          "& li": {
                            color: "rgba(255, 255, 255, 0.6)",
                            fontSize: "0.875rem",
                            mb: 0.5,
                          },
                        }}
                      >
                        {step.details.map((detail, i) => (
                          <li key={i}>{detail}</li>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </Box>

        {/* For Lenders Section */}
        <Box mb={8}>
          <Box display="flex" alignItems="center" gap={2} mb={4}>
            <Avatar
              sx={{
                bgcolor: "#6366f1",
                width: 56,
                height: 56,
              }}
            >
              <AccountBalanceIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography
              variant="h4"
              sx={{
                color: "white",
                fontWeight: 700,
              }}
            >
              For Lenders (Investors)
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {lenderSteps.map((step, index) => (
              <GridItem xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                    borderRadius: 4,
                    height: "100%",
                    textAlign: "center",
                    boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 40px rgba(99, 102, 241, 0.4)",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                      width: 64,
                      height: 64,
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    {step.icon}
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{ color: "white", fontWeight: 700, mb: 1 }}
                  >
                    {step.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                    {step.description}
                  </Typography>
                </Paper>
              </GridItem>
            ))}
          </Grid>
        </Box>

        {/* Key Features */}
        <Box mb={8}>
          <Typography
            variant="h4"
            textAlign="center"
            sx={{ color: "white", fontWeight: 700, mb: 6 }}
          >
            Why Choose MicroLend?
          </Typography>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <GridItem xs={12} sm={6} md={6} lg={6} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 4,
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box display="flex" alignItems="flex-start" gap={3}>
                      <Avatar
                        sx={{
                          background: feature.gradient,
                          width: 56,
                          height: 56,
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Box flex={1}>
                        <Typography
                          variant="h6"
                          sx={{ color: "white", fontWeight: 700, mb: 1 }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                        >
                          {feature.description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </Box>

        {/* FAQ Section */}
        <Box mb={8}>
          <Typography
            variant="h4"
            textAlign="center"
            sx={{ color: "white", fontWeight: 700, mb: 6 }}
          >
            Frequently Asked Questions
          </Typography>

          <Box maxWidth="900px" mx="auto">
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px !important",
                  mb: 2,
                  "&:before": { display: "none" },
                  "&.Mui-expanded": {
                    margin: "0 0 16px 0",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#f97316" }} />}
                  sx={{
                    "& .MuiAccordionSummary-content": {
                      my: 2,
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      fontWeight: 600,
                      fontSize: "1.1rem",
                    }}
                  >
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    variant="body1"
                    sx={{ color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.7 }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>

        {/* CTA Section */}
        <Paper
          elevation={0}
          sx={{
            p: 6,
            background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
            borderRadius: 4,
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(249, 115, 22, 0.4)",
          }}
        >
          <Typography
            variant="h4"
            sx={{ color: "white", fontWeight: 700, mb: 2 }}
          >
            Ready to Get Started?
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "rgba(255,255,255,0.9)", mb: 4, maxWidth: 600, mx: "auto" }}
          >
            Connect your wallet and join hundreds of students accessing affordable
            education financing on the blockchain.
          </Typography>
          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Chip
              label="🔒 100% Secure"
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 600,
                px: 2,
                py: 2.5,
              }}
            />
            <Chip
              label="⚡ Instant Approval"
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 600,
                px: 2,
                py: 2.5,
              }}
            />
            <Chip
              label="💰 5% Fixed Rate"
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 600,
                px: 2,
                py: 2.5,
              }}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}