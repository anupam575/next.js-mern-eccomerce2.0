"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedRoute from "./ProtectedRoute";

import {
  Drawer,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Switch,
} from "@mui/material";

import {
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
  Inventory2,
  Category,
  Add,
  People,
} from "@mui/icons-material";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [openDropdown, setOpenDropdown] = useState({
    products: false,
    categories: false,
    users: false,
    orders: false,
  });
  const pathname = usePathname();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleDropdown = (menu) => {
    setOpenDropdown((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const productItems = [
    {
      name: "Products",
      icon: <Inventory2 />,
      children: [
        { name: "Create Product", link: "/admin/create-product" },
        { name: "All Product", link: "/admin/products" },
      ],
    },
    {
      name: "Categories",
      icon: <Category />,
      children: [
        { name: "Create Category", link: "/admin/create-category" },
        { name: "All Category", link: "/admin/category" },
      ],
    },
    {
      name: "Users",
      icon: <People />,
      children: [
        { name: "All Users", link: "/admin/alluser" },
        { name: "User Charts", link: "/admin/alluser/charts" },
      ],
    },
    {
      name: "Orders",
      icon: <Add />,
      children: [
        { name: "All Orders", link: "/admin/all-orders" },
        { name: "Orders Chart", link: "/admin/all-orders/charts" },
      ],
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className={`${darkMode ? "dark" : ""} flex w-full min-h-screen`}>
        {/* Sidebar */}
        <Drawer
          variant="persistent"
          anchor="left"
          open={sidebarOpen}
          PaperProps={{
            className: `transition-all duration-300 ${
              darkMode ? "bg-gray-900 text-white" : "bg-white"
            } w-64 shadow-md border-r overflow-auto`,
            style: {
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE 10+
            },
          }}
        >
          <style jsx global>{`
            /* Sidebar scrollbar hide */
            .MuiDrawer-paper::-webkit-scrollbar {
              display: none; /* Chrome, Safari, Opera */
            }

            /* Main content scrollbar hide */
            main::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* Header */}
          <Box className="p-4 flex justify-between items-center border-b">
            <Typography variant="h6" className="font-bold">
              Admin Dashboard
            </Typography>
            <IconButton onClick={toggleSidebar} className={darkMode ? "text-white" : ""}>
              <ChevronLeft />
            </IconButton>
          </Box>

          {/* Menu */}
          <List>
            {productItems.map((item) => (
              <Box key={item.name}>
                {item.children ? (
                  <>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => handleDropdown(item.name.toLowerCase())}
                        className={`hover:bg-gray-200 dark:hover:bg-gray-700 ${
                          item.children.some((c) => c.link === pathname)
                            ? "bg-gray-200 dark:bg-gray-700"
                            : ""
                        }`}
                      >
                        <ListItemIcon className={darkMode ? "text-white" : ""}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.name} />
                        {openDropdown[item.name.toLowerCase()] ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                    </ListItem>
                    <Collapse
                      in={openDropdown[item.name.toLowerCase()]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {item.children.map((child) => (
                          <ListItem key={child.name} disablePadding>
                            <ListItemButton
                              component={Link}
                              href={child.link}
                              className={`pl-8 hover:bg-gray-200 dark:hover:bg-gray-700 ${
                                pathname === child.link ? "bg-gray-300 dark:bg-gray-600" : ""
                              }`}
                            >
                              <ListItemText primary={child.name} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </>
                ) : (
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      href={item.link}
                      className={`hover:bg-gray-200 dark:hover:bg-gray-700 ${
                        pathname === item.link ? "bg-gray-300 dark:bg-gray-600" : ""
                      }`}
                    >
                      <ListItemIcon className={darkMode ? "text-white" : ""}>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.name} />
                    </ListItemButton>
                  </ListItem>
                )}
              </Box>
            ))}
          </List>

          {/* Dark Mode Toggle */}
          <Box className="p-4 border-t flex items-center justify-between">
            <Typography variant="body1">Dark Mode</Typography>
            <Switch checked={darkMode} onChange={toggleDarkMode} />
          </Box>
        </Drawer>

        {/* Toggle Button When Sidebar Closed */}
        {!sidebarOpen && (
          <IconButton
            onClick={toggleSidebar}
            className={`absolute top-4 left-4 bg-white dark:bg-gray-900 shadow-md ${
              darkMode ? "text-white" : ""
            }`}
          >
            <ChevronRight />
          </IconButton>
        )}

        {/* Main Content */}
        <main
          className={`flex-1 p-6 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-0"
          } ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"} overflow-auto`}
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE 10+
          }}
        >
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
