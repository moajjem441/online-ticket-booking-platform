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
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6" style={{ fontFamily: 'sans-serif' }}>
      {/* সেকশন হেডার */}
      <div className="border-b border-gray-100 dark:border-neutral-800 pb-4">
        <h2 className={`${title} text-2xl font-bold m-0`}>🔥 Popular Travel Routes</h2>
        <p className={`${muted} text-sm m-0 mt-1`}>Most frequently traveled routes by our community</p>
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
              <h3 className={`${title} text-sm font-bold m-0 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
                {route.from} ➔ {route.to}
              </h3>
              <p className={`${muted} text-xs m-0 mt-0.5`}>{route.count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularRoutes;