"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { IconButton, Box } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";

const Middle = () => {
  const slides = [
    { image: "/banner1.jpg" },
    { image: "/banner2.jpg" },
    { image: "/banner3.jpg" },
    { image: "/banner4.jpg" },
    { image: "/banner5.jpg" },
  ];

  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  const nextSlide = () => setIndex((i) => (i + 1) % slides.length);
  const prevSlide = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 4000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const pauseSlider = () => clearInterval(intervalRef.current);
  const resumeSlider = () => (intervalRef.current = setInterval(nextSlide, 4000));

  return (
    <Box
      className="relative w-full h-[650px] sm:h-[400px] md:h-[450px] overflow-hidden"
      onMouseEnter={pauseSlider}
      onMouseLeave={resumeSlider}
    >
      {/* Image */}
      <Image
        src={slides[index].image}
        alt={`Banner ${index + 1}`}
        priority
        fill
        className="object-cover transition-opacity duration-700"
      />

      {/* Gradient Top */}
      <div className="absolute top-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-b from-black/60 to-transparent"></div>

      {/* Gradient Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-white to-transparent"></div>

      {/* Left Arrow */}
      <IconButton
        onClick={prevSlide}
        className="!absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 !bg-white shadow-xl hover:!bg-gray-200 z-20 !p-2 sm:!p-3 rounded-full"
      >
        <ArrowBackIosNew fontSize="medium" />
      </IconButton>

      {/* Right Arrow */}
      <IconButton
        onClick={nextSlide}
        className="!absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 !bg-white shadow-xl hover:!bg-gray-200 z-20 !p-2 sm:!p-3 rounded-full"
      >
        <ArrowForwardIos fontSize="medium" />
      </IconButton>
    </Box>
  );
};

export default Middle;
