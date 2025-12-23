"use client";
import { useDispatch } from "react-redux";
import Middle from "./components/Home/Middle"; 
import CategorySection from "./components/Home/CategorySection";
 import FeaturedProducts from "./components/Home/FeaturedProducts";
  import Footer from "./components/Home/Footer";
import { useEffect } from "react";
import { fetchUser } from "../redux/slices/authSlice";

export default function HomePage() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    return (
        <div>
            <Middle />
            <CategorySection />
            <FeaturedProducts />
            <Footer />
        </div>
    );
}
