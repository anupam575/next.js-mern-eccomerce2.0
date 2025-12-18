"use client";

import { Card, CardMedia, CardContent, Typography } from "@mui/material";

const categories = [
  { id: 1, name: "Headphones", image: "/images/product1.jpg" },
  { id: 2, name: "Watches", image: "/images/product2.jpg" },
  { id: 3, name: "Shoes", image: "/images/product3.jpg" },
  { id: 4, name: "Gaming", image: "/images/product4.jpg" },
];

export default function FeaturedProducts() {
  return (
    <div className="px-8 py-6">
      <Typography variant="h4" gutterBottom>
        Featured Products
      </Typography>

      {/* Tailwind flex grid: 1 row me 4 items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Card
            key={cat.id}
            className="cursor-pointer transition-transform duration-300 hover:scale-105"
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 3,
            }}
          >
            <CardMedia
              component="img"
              image={cat.image}
              alt={cat.name}
              height="250"
            />
            <CardContent>
              <Typography
                variant="subtitle1"
                align="center"
                sx={{ fontWeight: 500 }}
              >
                {cat.name}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
