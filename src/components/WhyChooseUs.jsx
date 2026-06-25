"use client";

import React from 'react';
import { card, text, title, muted } from "@/styles/ui";

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      icon: "⚡",
      title: "Instant Booking",
      desc: "Book your verified tickets within a minute without any complex paperwork or long queues."
    },
    {
      id: 2,
      icon: "🛡️",
      title: "Anti-Fraud Verification",
      desc: "Every single ticket and vendor is manually verified by our Admin panel to prevent double-selling."
    },
    {
      id: 3,
      icon: "🎧",
      title: "24/7 Support",
      desc: "Got an issue during the journey? Our team is always awake to assist you at any bus or train counters."
    }
  ];

  return (
    <section className="relative w-full bg-white dark:bg-[#0d0811] py-16 overflow-hidden transition-colors duration-300">
      
      {/* 🔮 ব্যানার স্টাইল ব্যাকগ্রাউন্ড গ্লো (Background Glows) */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-500/10 dark:bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-8 z-10 relative" style={{ fontFamily: 'sans-serif' }}>
        
        {/* সেকশন হেডার - ব্যানারের মতো ব্যাজ স্টাইল এবং টেক্সট অ্যালাইনমেন্ট */}
        <div className="flex flex-col items-center gap-3 text-center max-w-2xl mx-auto pb-2">
          
          {/* ব্যানার স্টাইল ব্যাজ */}
          <div className="inline-flex items-center border border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 text-[11px] font-semibold px-4 py-1.5 rounded-full backdrop-blur-md">
            Our Top Priorities
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white m-0">
            🤔 Why Choose Our{" "}
            <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              Platform?
            </span>
          </h2>
          
          <p className={`${muted} text-sm md:text-base font-light max-w-xl leading-relaxed m-0 mt-1`}>
            We offer the safest, fastest and most transparent ticketing ecosystem in Bangladesh
          </p>
        </div>

        {/* ৩-কলাম ফিচার গ্রিড - ব্যানারের মতো মিনিমাল ট্রান্সপারেন্ট কার্ড */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {features.map((item) => (
            <div 
              key={item.id} 
              className="p-6 rounded-2xl border border-gray-200/60 dark:border-purple-500/10 bg-gray-50/50 dark:bg-purple-950/5 backdrop-blur-md shadow-sm hover:shadow-md hover:border-indigo-500/40 dark:hover:border-indigo-500/30 transition-all text-center flex flex-col items-center space-y-4 group"
            >
              {/* আইকন হোল্ডার */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-neutral-900 dark:to-neutral-800 border border-gray-100 dark:border-neutral-800 text-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              
              {/* টাইটেল */}
              <h3 className={`${title} text-base font-bold m-0 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors`}>
                {item.title}
              </h3>
              
              {/* ডেসক্রিপশন */}
              <p className={`${text} text-gray-600 dark:text-neutral-400 text-xs md:text-sm font-light leading-relaxed m-0`}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;