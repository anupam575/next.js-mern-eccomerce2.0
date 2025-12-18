"use client";

import Link from "next/link";
import { AppBar, Toolbar, Box, Button, Typography } from "@mui/material";
import Navbar from "./Navbar";

const Panel = () => {
  return (
    <Box>
      {/* Top AppBar */}
      <AppBar
        position="static"
        sx={{ backgroundColor: "#232f3e", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
      >
        <Toolbar
          sx={{
            minHeight: "50px !important",
            height: "50px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            position: "relative",
          }}
        >
          {/* Left side - Navbar/Menu */}
          <Box sx={{ display: "flex", alignItems: "center", ml:3 }}>
            <Navbar />
          </Box>

          {/* Center - Navigation Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: "24px",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <Button
              component={Link}
              href="/"
              color="inherit"
              sx={{ textTransform: "none", "&:hover": { backgroundColor: "inherit" } }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", letterSpacing: "1px" }}>
                Home
              </Typography>
            </Button>

            <Button
              component={Link}
              href="/product"
              color="inherit"
              sx={{ textTransform: "none", "&:hover": { backgroundColor: "inherit" } }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", letterSpacing: "1px" }}>
                Product
              </Typography>
            </Button>

            <Button
              component={Link}
              href="/about"
              color="inherit"
              sx={{ textTransform: "none", "&:hover": { backgroundColor: "inherit" } }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", letterSpacing: "1px" }}>
                About
              </Typography>
            </Button>
          </Box>

          {/* Right side - optional */}
          <Box />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Panel;
