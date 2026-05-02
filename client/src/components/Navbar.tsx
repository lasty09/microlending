import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit"; // ← add this import

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
    null,
  );

  const navLinks = [
    { name: "Dashboard", path: "/" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "Borrow", path: "/borrow" },
    { name: "Lend", path: "/lend" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  return (
    <AppBar
      position="sticky"
      color="primary"
      elevation={4}
      sx={{ bgcolor: "background.paper" }}
    >
      <Toolbar>
        {/* Logo */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            textDecoration: "none",
            color: "primary.main",
            "&:hover": { color: "primary.light" },
          }}
        >
          MicroLend
        </Typography>

        {/* Desktop Links */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          {navLinks.map((link) => (
            <Button
              key={link.name}
              component={Link}
              to={link.path}
              color="inherit"
              sx={{
                fontWeight: isActive(link.path) ? "bold" : "normal",
                borderBottom: isActive(link.path) ? "2px solid" : "none",
                borderColor: "primary.main",
                borderRadius: 0,
                px: 2,
                "&:hover": { bgcolor: "rgba(249, 115, 22, 0.08)" },
              }}
            >
              {link.name}
            </Button>
          ))}
        </Box>

        {/* Connect Wallet (desktop) – real RainbowKit button */}
        <Box sx={{ display: { xs: "none", md: "block" }, ml: 2 }}>
          <ConnectButton
            showBalance={false}
            chainStatus="icon"
            accountStatus={{
              smallScreen: "address",
              largeScreen: "full",
            }}
          />
        </Box>

        {/* Mobile Hamburger */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={mobileMenuAnchor}
            open={Boolean(mobileMenuAnchor)}
            onClose={handleMobileMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {navLinks.map((link) => (
              <MenuItem
                key={link.name}
                component={Link}
                to={link.path}
                onClick={handleMobileMenuClose}
                selected={isActive(link.path)}
                sx={{
                  color: isActive(link.path) ? "primary.main" : "inherit",
                  fontWeight: isActive(link.path) ? "bold" : "normal",
                }}
              >
                {link.name}
              </MenuItem>
            ))}
            {/* Real RainbowKit ConnectButton in mobile menu */}
            <MenuItem onClick={handleMobileMenuClose}>
              <ConnectButton />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
