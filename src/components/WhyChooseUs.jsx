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
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6" style={{ fontFamily: 'sans-serif' }}>
      {/* সেকশন হেডার */}
      <div className="border-b border-gray-100 dark:border-neutral-800 pb-4 text-center max-w-xl mx-auto border-none">
        <h2 className={`${title} text-2xl font-bold m-0`}>🤔 Why Choose Our Platform?</h2>
        <p className={`${muted} text-sm m-0 mt-1`}>We offer the safest, fastest and most transparent ticketing ecosystem in Bangladesh</p>
      </div>

      {/* ৩-কলাম ফিচার গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {features.map((item) => (
          <div 
            key={item.id} 
            className={`${card} p-6 rounded-xl border border-gray-50 dark:border-neutral-800/50 bg-gray-50/50 dark:bg-neutral-900/30 text-center flex flex-col items-center space-y-3 shadow-sm`}
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl font-bold">
              {item.icon}
            </div>
            <h3 className={`${title} text-base font-bold m-0`}>{item.title}</h3>
            <p className={`${text} ${muted} text-xs leading-relaxed m-0`}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;