"use client";

import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen  bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl w-full  bg-white shadow-lg rounded-xl overflow-hidden flex flex-col lg:flex-row items-center mt-8">
        
        {/* Developer Image */}
        <div className="relative w-full lg:w-1/2 h-150 lg:h-[800px]">
          <Image
            src="/images/developers.jpg"
            alt="MERN Developer"
            className="object-cover w-full h-full rounded-l-xl"
            fill
            priority
          />
        </div>

        {/* About Text */}
        <div className="lg:w-1/2 w-full p-8 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">About Us</h1>
          <h2 className="text-2xl text-gray-700 mb-6">
            Hi, I'm a MERN Stack Developer
          </h2>
          <p className="text-gray-600 mb-4">
            Welcome to our eCommerce platform! I specialize in building fast,
            secure, and scalable applications using the MERN stack — MongoDB,
            Express.js, React, and Node.js.
          </p>
          <p className="text-gray-600 mb-6">
            This project focuses on delivering smooth, modern shopping
            experiences with smart backend logic and clean user interfaces.
            My goal is to turn great ideas into fully functional and beautiful
            products that people love to use.
          </p>

          <Link
            href="/contact"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-300"
          >
            Contact Me
          </Link>
        </div>

      </div>
    </div>
  );
}
