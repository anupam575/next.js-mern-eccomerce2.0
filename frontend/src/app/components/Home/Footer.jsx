"use client";

import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import { Facebook, Instagram, Twitter, YouTube } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box component="footer" className="bg-gray-900 text-white pt-12 px-6 md:px-16">
      {/* Top Section */}
      <Box className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <Box>
          <Typography variant="h6" className="mb-4 font-semibold">Company</Typography>
          <ul className="space-y-2">
            <li><a href="/about" className="hover:text-gray-300">About Us</a></li>
            <li><a href="/contact" className="hover:text-gray-300">Contact Us</a></li>
            <li><a href="/careers" className="hover:text-gray-300">Careers</a></li>
            <li><a href="/blog" className="hover:text-gray-300">Blog</a></li>
          </ul>
        </Box>

        {/* Customer Service */}
        <Box>
          <Typography variant="h6" className="mb-4 font-semibold">Customer Service</Typography>
          <ul className="space-y-2">
            <li><a href="/faq" className="hover:text-gray-300">FAQs</a></li>
            <li><a href="/returns" className="hover:text-gray-300">Return Policy</a></li>
            <li><a href="/shipping" className="hover:text-gray-300">Shipping Info</a></li>
            <li><a href="/track" className="hover:text-gray-300">Track Order</a></li>
            <li><a href="/payments" className="hover:text-gray-300">Payment Methods</a></li>
          </ul>
        </Box>

        {/* Quick Links */}
        <Box>
          <Typography variant="h6" className="mb-4 font-semibold">Quick Links</Typography>
          <ul className="space-y-2">
            <li><a href="/men" className="hover:text-gray-300">Men</a></li>
            <li><a href="/women" className="hover:text-gray-300">Women</a></li>
            <li><a href="/kids" className="hover:text-gray-300">Kids</a></li>
            <li><a href="/sale" className="hover:text-gray-300">Sale</a></li>
            <li><a href="/new" className="hover:text-gray-300">New Arrivals</a></li>
          </ul>
        </Box>

        {/* Newsletter & Social */}
        <Box>
          <Typography variant="h6" className="mb-4 font-semibold">Subscribe</Typography>
          <Typography variant="body2" className="mb-3">Get latest offers & updates</Typography>
          <Box component="form" className="flex gap-2 mb-4">
            <TextField
              size="small"
              placeholder="Enter your email"
              variant="outlined"
              className="bg-white rounded-md w-full"
            />
            <Button variant="contained" color="primary">Subscribe</Button>
          </Box>

          <Box className="flex gap-3">
            <IconButton color="inherit"><Facebook /></IconButton>
            <IconButton color="inherit"><Instagram /></IconButton>
            <IconButton color="inherit"><Twitter /></IconButton>
            <IconButton color="inherit"><YouTube /></IconButton>
          </Box>
        </Box>
      </Box>

      {/* Bottom Section */}
      <Box className="mt-12 border-t border-gray-700 pt-6 flex justify-center">
        <Typography variant="body2">© 2025 Mahakalbhakt. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default Footer;
