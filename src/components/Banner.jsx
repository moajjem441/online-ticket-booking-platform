"use client";
import React from "react";
import { Button } from "@heroui/react";
import Link from "next/link";
import { FaBus, FaTrain, FaSearch } from "react-icons/fa";

export default function Banner() {
  return (
    <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-[#0d0811]">
      
      {/* Background Glows (আপনার দেওয়া ৩ নম্বর স্ক্রিনশটের মতো নিয়ন ব্লু এবং পার্পল গ্লো ইফেক্ট) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto z-10 flex flex-col items-center gap-6 mt-12">
        
        {/* Top Tag/Badge (২ নম্বর স্ক্রিনশটের Warner & Spencer স্টাইল রাউন্ডেড বর্ডার) */}
        <div className="inline-flex items-center gap-2 border border-purple-500/30 bg-purple-950/20 text-purple-300 text-xs font-semibold px-4 py-1.5 rounded-full backdrop-blur-md animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Seamless Ticket Booking Experience
        </div>

        {/* Hero Main Heading (লোগোর টেক্সট ডিজাইনের মতো গ্রেডিয়েন্ট মিক্স) */}
        <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-none max-w-3xl">
          Your Ultimate Platform for{" "}
          <span className="bg-gradient-to-r from-violet-500 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Bus
          </span>{" "}
          &{" "}
          <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(244,63,94,0.25)]">
            Train
          </span>{" "}
          Tickets.
        </h1>

        {/* Subtitle */}
        <p className="text-neutral-400 text-base md:text-xl max-w-xl md:max-w-2xl font-light leading-relaxed">
          Skip the long queues. Book your bus and train tickets instantly from the comfort of your home with <span className="text-neutral-200 font-medium">TicketBari</span>.
        </p>

        {/* Action Buttons (১ নম্বর স্ক্রিনশটের ভাইব্রেন্ট ব্লু বাটন স্টাইল) */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          <Button
            as={Link}
            href="/tickets"
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-8 h-14 rounded-xl shadow-lg shadow-indigo-600/30 hover:opacity-95 transition-all text-base"
          >
            <FaSearch className="text-sm mr-1" /> Book Tickets Now
          </Button>
          
          <Button
            as={Link}
            href="#how-it-works"
            size="lg"
            variant="bordered"
            className="border-neutral-800 text-neutral-300 font-medium px-8 h-14 rounded-xl hover:bg-neutral-900/50 hover:text-white transition-all text-base bg-neutral-950/20 backdrop-blur-sm"
          >
            Learn More
          </Button>
        </div>

      

        {/* Feature Triggers */}
        <div className="flex items-center gap-6 mt-6 text-xs md:text-sm text-neutral-500 font-medium">
          <span className="flex items-center gap-1.5"><FaBus className="text-blue-500" /> 500+ Bus Routes</span>
          <div className="w-1.5 h-1.5 bg-neutral-800 rounded-full" />
          <span className="flex items-center gap-1.5"><FaTrain className="text-pink-500" /> Intercity Trains</span>
        </div>

      </div>
    </section>
  );
}