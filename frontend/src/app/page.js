"use client";
import Middle from "./components/Home/Middle";
import CategorySection from "./components/Home/CategorySection";
import FeaturedProducts from "./components/Home/FeaturedProducts";
import Footer from "./components/Home/Footer";

export default function HomePage() {
  return (
    <div>
      <Middle />
      <CategorySection />
      <FeaturedProducts />
      <Footer />
    </div>
  );
}
