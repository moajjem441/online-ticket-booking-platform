"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaBus, FaTrain, FaShip, FaPlane, FaSearch } from "react-icons/fa";

// ডাইনামিক অ্যানিমেশনের জন্য ডাটা অবজেক্ট
const TransportWords = [
  { text: "Bus", gradient: "from-violet-600 via-indigo-500 to-cyan-500", glow: "rgba(99,102,241,0.25)" },
  { text: "Train", gradient: "from-pink-500 via-rose-400 to-orange-400", glow: "rgba(244,63,94,0.25)" },
  { text: "Launch", gradient: "from-emerald-500 via-teal-400 to-cyan-400", glow: "rgba(16,185,129,0.25)" },
  { text: "Flight", gradient: "from-blue-600 via-indigo-500 to-violet-500", glow: "rgba(37,99,235,0.25)" }
];

export default function Banner() {
  const [index, setIndex] = useState(0);

  // প্রতি ২.৫ সেকেন্ড পর পর শব্দ পরিবর্তন করার ইফেক্ট
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % TransportWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

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

        {/* Dynamic Heading with Typewriter Slide Effect */}
        <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-none max-w-3xl text-gray-900 dark:text-white">
          Your Ultimate Platform for{" "}
          <span className="inline-block relative min-w-[150px] sm:min-w-[180px] md:min-w-[250px] text-left align-bottom h-[1.1em] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={TransportWords[index].text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{
                  filter: `drop-shadow(0 0 25px ${TransportWords[index].glow})`
                }}
                className={`absolute left-0 bottom-0 bg-gradient-to-r ${TransportWords[index].gradient} bg-clip-text text-transparent`}
              >
                {TransportWords[index].text}
              </motion.span>
            </AnimatePresence>
          </span>{" "}
          Tickets.
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 dark:text-neutral-400 text-base md:text-xl max-w-xl md:max-w-3xl font-light leading-relaxed">
          Skip the long queues. Book your bus, train, launch, and flight tickets instantly from the comfort of your home with{" "}
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

        {/* Features / Categories Badge Bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-6 text-xs md:text-sm text-gray-500 dark:text-neutral-500 font-medium max-w-xl">
          
          <span className="flex items-center gap-1.5">
            <FaBus className="text-blue-500" />
            500+ Bus Routes
          </span>

          <div className="hidden sm:block w-1.5 h-1.5 bg-gray-300 dark:bg-neutral-800 rounded-full" />

          <span className="flex items-center gap-1.5">
            <FaTrain className="text-pink-500" />
            Intercity Trains
          </span>

          <div className="hidden sm:block w-1.5 h-1.5 bg-gray-300 dark:bg-neutral-800 rounded-full" />

          <span className="flex items-center gap-1.5">
            <FaShip className="text-emerald-500" />
            River Launches
          </span>

          <div className="hidden sm:block w-1.5 h-1.5 bg-gray-300 dark:bg-neutral-800 rounded-full" />

          <span className="flex items-center gap-1.5">
            <FaPlane className="text-violet-500" />
            Domestic Flights
          </span>

        </div>

      </div>
    </section>
  );
}