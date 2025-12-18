"use client";

import * as React from "react";
import Link from "next/link";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Inventory2Icon from "@mui/icons-material/Inventory2";

export default function Navbar() {
  const [open, setOpen] = React.useState(false);

  // ⭐ MUI recommended, safe Drawer toggle function
  const toggleDrawer = (state) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(state);
  };

  // Drawer Content
  const DrawerList = (
    <Box sx={{ width: 260 }} role="presentation" onKeyDown={toggleDrawer(false)}>
      {/* Close Button */}
      <Box className="flex justify-end p-3">
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Drawer Links */}
      <List>
        {/* My Account */}
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/profile">
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText
              primary="My Account"
              primaryTypographyProps={{ fontSize: 17, fontWeight: 500 }}
            />
          </ListItemButton>
        </ListItem>

        {/* My Orders */}
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/my-orders">
            <ListItemIcon>
              <Inventory2Icon />
            </ListItemIcon>
            <ListItemText
              primary="My Orders"
              primaryTypographyProps={{ fontSize: 17, fontWeight: 500 }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {/* Menu Open Button */}
      <IconButton
        edge="start"
        color="inherit"
        onClick={toggleDrawer(true)}
        sx={{ padding: 0, marginRight: 1 }}
      >
        <MenuIcon style={{ fontSize: 40 }} />
      </IconButton>

      {/* Drawer Component */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </>
  );
}