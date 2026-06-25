"use client";

import React from 'react';
import { card, title, muted } from "@/styles/ui";

const PopularRoutes = () => {
  // ডামি ডেটা (বাংলাদেশের টপ ট্রেন্ডিং রুটস)
  const routes = [
    { id: 1, from: "Dhaka", to: "Cox's Bazar", count: "12+ Coaches", icon: "🏖️" },
    { id: 2, from: "Dhaka", to: "Sylhet", count: "8+ Services", icon: "🍵" },
    { id: 3, from: "Dhaka", to: "Chittagong", count: "15+ Daily Trips", icon: "🚢" },
    { id: 4, from: "Dhaka", to: "Rajshahi", count: "6+ Express Buses", icon: "🥭" },
  ];

  return (
    <section className="relative w-full bg-white dark:bg-[#0d0811] py-12 overflow-hidden transition-colors duration-300">
      
      {/* 🔮 ব্যাকগ্রাউন্ডেড মৃদু নিয়ন গ্লো - যা পুরো পেজের থিমকে প্রফেশনাল লুক দেবে */}
      <div className="absolute top-[30%] right-[-10%] w-[35vw] h-[35vw] bg-pink-500/5 dark:bg-pink-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[25vw] h-[25vw] bg-cyan-500/5 dark:bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6 z-10 relative" style={{ fontFamily: 'sans-serif' }}>
        
      
       {/* সেকশন হেডার */}
<div className="border-b border-gray-100 dark:border-neutral-800 pb-4">
  <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white m-0">
    🔥 Popular Travel{" "}
    <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(244,63,94,0.15)]">
      Routes
    </span>
  </h2>
  <p className={`${muted} text-sm md:text-base m-0 mt-1 font-light`}>Most frequently traveled routes by our community</p>
</div>

        {/* ৪-কলাম রুট গ্রিড */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {routes.map((route) => (
            <div 
              key={route.id} 
              className={`${card} flex items-center p-4 rounded-xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer group`}
            >
              <div className="text-3xl bg-gray-50 dark:bg-neutral-800 p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                {route.icon}
              </div>
              <div>
                <h3 className={`${title} text-sm font-bold m-0 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
                  {route.from} ➔ {route.to}
                </h3>
                <p className={`${muted} text-xs m-0 mt-0.5`}>{route.count}</p>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default PopularRoutes;