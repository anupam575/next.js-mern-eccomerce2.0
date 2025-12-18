"use client";

import { Card, CardContent, Typography } from "@mui/material";

const categories = [
  { name: "Men's Fashion", image: "/images/men.jpg" },
  { name: "Women's Fashion", image: "/images/women.jpg" },
  { name: "Electronics", image: "/images/electronics.jpg" },
  { name: "Home Appliances", image: "/images/home.jpg" },
];

function CategorySection() {
  return (
    <div className="px-8 py-6">
      <Typography variant="h4" className="mb-6">
        Shop by Category
      </Typography>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-80 object-fill rounded-t-md"
            />
            <CardContent className="text-center">
              <Typography variant="subtitle1">{cat.name}</Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default CategorySection;
