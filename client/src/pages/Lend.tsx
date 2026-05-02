import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Avatar,
  Chip,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const GridItem = Grid as React.ElementType;

export default function Lend() {
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
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
            }}
          >
            Lend & Earn
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
            Deposit funds to the pool and earn 5% fixed interest while helping
            students achieve their educational goals
          </Typography>

          {/* Info Chips */}
          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            <Chip
              icon={<TrendingUpIcon />}
              label="5% Fixed Returns"
              sx={{
                px: 2,
                py: 2.5,
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: 10,
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                boxShadow: "0 4px 20px rgba(16, 185, 129, 0.3)",
                "& .MuiChip-icon": { color: "white" },
              }}
            />
            <Chip
              icon={<SecurityIcon />}
              label="Blockchain Secured"
              sx={{
                px: 2,
                py: 2.5,
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: 10,
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                color: "white",
                boxShadow: "0 4px 20px rgba(99, 102, 241, 0.3)",
                "& .MuiChip-icon": { color: "white" },
              }}
            />
          </Box>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {/* Deposit Form */}
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
                      bgcolor: "rgba(99, 102, 241, 0.2)",
                      width: 56,
                      height: 56,
                    }}
                  >
                    <AccountBalanceIcon sx={{ fontSize: 32, color: "#6366f1" }} />
                  </Avatar>
                  <Typography
                    variant="h5"
                    sx={{ color: "white", fontWeight: 700 }}
                  >
                    Deposit to Lending Pool
                  </Typography>
                </Box>

                <Box component="form" sx={{ mt: 4 }}>
                  <TextField
                    fullWidth
                    label="Amount to Deposit (KSh)"
                    type="number"
                    variant="outlined"
                    placeholder="e.g. 50000"
                    helperText="You will earn 5% fixed interest while helping students"
                    sx={{
                      mb: 4,
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        fontSize: "1.1rem",
                        "& fieldset": {
                          borderColor: "rgba(99, 102, 241, 0.3)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(99, 102, 241, 0.5)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#6366f1",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255,255,255,0.6)",
                        fontSize: "1rem",
                      },
                      "& .MuiFormHelperText-root": {
                        color: "rgba(255,255,255,0.5)",
                      },
                    }}
                  />

                  <Box mt={5} textAlign="center">
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        px: 8,
                        py: 2.5,
                        borderRadius: 3,
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        textTransform: "none",
                        background:
                          "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                        boxShadow: "0 4px 20px rgba(99, 102, 241, 0.4)",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 24px rgba(99, 102, 241, 0.5)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      💰 Deposit Now
                    </Button>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.5)", mt: 2 }}
                    >
                      Secure deposits • Instant transactions • Withdraw anytime
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </GridItem>

          {/* Benefits Card */}
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
                  Why Lend with MicroLend?
                </Typography>
                <List sx={{ p: 0 }}>
                  <ListItem sx={{ px: 0, mb: 2 }}>
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: "rgba(16, 185, 129, 0.2)",
                          width: 40,
                          height: 40,
                        }}
                      >
                        <TrendingUpIcon sx={{ color: "#10b981" }} />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ color: "white", fontWeight: 600 }}>
                          5% Fixed Interest
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255,255,255,0.6)" }}
                        >
                          Predictable returns
                        </Typography>
                      }
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, mb: 2 }}>
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: "rgba(99, 102, 241, 0.2)",
                          width: 40,
                          height: 40,
                        }}
                      >
                        <VerifiedUserIcon sx={{ color: "#6366f1" }} />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ color: "white", fontWeight: 600 }}>
                          Verified Students Only
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255,255,255,0.6)" }}
                        >
                          Reduced risk
                        </Typography>
                      }
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, mb: 2 }}>
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: "rgba(245, 158, 11, 0.2)",
                          width: 40,
                          height: 40,
                        }}
                      >
                        <SecurityIcon sx={{ color: "#f59e0b" }} />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ color: "white", fontWeight: 600 }}>
                          Blockchain Transparent
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255,255,255,0.6)" }}
                        >
                          All transactions on-chain
                        </Typography>
                      }
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: "rgba(249, 115, 22, 0.2)",
                          width: 40,
                          height: 40,
                        }}
                      >
                        <SpeedIcon sx={{ color: "#f97316" }} />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ color: "white", fontWeight: 600 }}>
                          Instant Liquidity
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255,255,255,0.6)" }}
                        >
                          Withdraw anytime
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </GridItem>
        </Grid>

        {/* Stats Section */}
        <Grid container spacing={3} mt={4}>
          <GridItem xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                borderRadius: 4,
                textAlign: "center",
                boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)",
              }}
            >
              <Typography
                variant="h3"
                sx={{ color: "white", fontWeight: 800, mb: 1 }}
              >
                5%
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                Fixed Annual Interest
              </Typography>
            </Paper>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                borderRadius: 4,
                textAlign: "center",
                boxShadow: "0 8px 32px rgba(16, 185, 129, 0.3)",
              }}
            >
              <Typography
                variant="h3"
                sx={{ color: "white", fontWeight: 800, mb: 1 }}
              >
                100%
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                On-chain Transparency
              </Typography>
            </Paper>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                borderRadius: 4,
                textAlign: "center",
                boxShadow: "0 8px 32px rgba(249, 115, 22, 0.3)",
              }}
            >
              <Typography
                variant="h3"
                sx={{ color: "white", fontWeight: 800, mb: 1 }}
              >
                0
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                Hidden Fees
              </Typography>
            </Paper>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                borderRadius: 4,
                textAlign: "center",
                boxShadow: "0 8px 32px rgba(139, 92, 246, 0.3)",
              }}
            >
              <Typography
                variant="h3"
                sx={{ color: "white", fontWeight: 800, mb: 1 }}
              >
                24/7
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                Deposit & Withdraw
              </Typography>
            </Paper>
          </GridItem>
        </Grid>

        {/* CTA Section */}
        <Paper
          elevation={0}
          sx={{
            mt: 6,
            p: 6,
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            borderRadius: 4,
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(99, 102, 241, 0.4)",
          }}
        >
          <Typography
            variant="h4"
            sx={{ color: "white", fontWeight: 700, mb: 2 }}
          >
            Start Earning Today
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255,255,255,0.9)",
              mb: 4,
              maxWidth: 600,
              mx: "auto",
            }}
          >
            Join our community of lenders earning consistent returns while
            empowering the next generation of students.
          </Typography>
          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Chip
              icon={<CheckCircleIcon />}
              label="Smart Contract Secured"
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 600,
                px: 2,
                py: 2.5,
                "& .MuiChip-icon": { color: "white" },
              }}
            />
            <Chip
              icon={<LocalAtmIcon />}
              label="Passive Income"
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 600,
                px: 2,
                py: 2.5,
                "& .MuiChip-icon": { color: "white" },
              }}
            />
            <Chip
              icon={<VerifiedUserIcon />}
              label="Verified Borrowers"
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 600,
                px: 2,
                py: 2.5,
                "& .MuiChip-icon": { color: "white" },
              }}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}