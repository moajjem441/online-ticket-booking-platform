"use client";

import React from "react";
import { Button } from "@heroui/react";
import Link from "next/link";
import { FaBus, FaTrain, FaSearch } from "react-icons/fa";

export default function Banner() {
  return (
    <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-white dark:bg-[#0d0811] transition-colors duration-300">

      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto z-10 flex flex-col items-center gap-6 mt-12">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-purple-300 dark:border-purple-500/30 bg-purple-100 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 text-xs font-semibold px-4 py-1.5 rounded-full backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Seamless Ticket Booking Experience
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-none max-w-3xl text-gray-900 dark:text-white">
          Your Ultimate Platform for{" "}
          <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
            Bus
          </span>{" "}
          &{" "}
          <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(244,63,94,0.25)]">
            Train
          </span>{" "}
          Tickets.
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 dark:text-neutral-400 text-base md:text-xl max-w-xl md:max-w-2xl font-light leading-relaxed">
          Skip the long queues. Book your bus and train tickets instantly from the comfort of your home with{" "}
          <span className="text-gray-900 dark:text-neutral-200 font-medium">
            TicketBari
          </span>.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">

          <Button
            as={Link}
            href="/tickets"
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-8 h-14 rounded-xl shadow-lg shadow-indigo-600/30 hover:opacity-95 transition-all text-base"
          >
            <FaSearch className="text-sm mr-2" />
            Book Tickets Now
          </Button>

          <Button
            as={Link}
            href="#how-it-works"
            size="lg"
            variant="bordered"
            className="border-gray-300 dark:border-neutral-800 text-gray-700 dark:text-neutral-300 font-medium px-8 h-14 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-900/50 hover:text-black dark:hover:text-white transition-all backdrop-blur-sm"
          >
            Learn More
          </Button>

        </div>

        {/* Features */}
        <div className="flex items-center gap-6 mt-6 text-xs md:text-sm text-gray-500 dark:text-neutral-500 font-medium">
          
          <span className="flex items-center gap-1.5">
            <FaBus className="text-blue-500" />
            500+ Bus Routes
          </span>

          <div className="w-1.5 h-1.5 bg-gray-300 dark:bg-neutral-800 rounded-full" />

          <span className="flex items-center gap-1.5">
            <FaTrain className="text-pink-500" />
            Intercity Trains
          </span>

        </div>

      </div>
    </section>
  );
}