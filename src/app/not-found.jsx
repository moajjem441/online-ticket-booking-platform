"use client";
import React from 'react';
import Link from 'next/link';
// আপনার ডিজাইন টোকেনসমূহ ইমপোর্ট করুন
import { title, text, muted, buttonPrimary } from "@/styles/ui";

const NotFound = () => {
  return (
    // bg-background ব্যবহার করা হয়েছে যাতে লেআউটের থিমের সাথে ব্যাকগ্রাউন্ড অটো-সিঙ্ক হয়
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center transition-colors relative overflow-hidden">
      
      {/* Background Glows (টিকিটবাড়ির ভাইব ফুটিয়ে তোলার জন্য) */}
      <div className="absolute w-[300px] h-[300px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[100px] top-1/4 left-1/4 pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-pink-600/5 dark:bg-pink-600/10 rounded-full blur-[100px] bottom-1/4 right-1/4 pointer-events-none" />

      {/* 404 Number Design */}
      <div className="relative z-10 select-none">
        {/* ডার্ক মোডে টেক্সট যেন সাদা না হয়ে সুন্দর আবছা গ্রে থাকে, সেজন্য কাস্টম ক্লাস দেওয়া হয়েছে */}
        <h1 className="text-9xl md:text-[12rem] font-black tracking-widest text-neutral-200 dark:text-neutral-800/60 drop-shadow-sm transition-colors">
          404
        </h1>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-xs md:text-sm rounded-xl rotate-12 text-white font-semibold shadow-xl tracking-wider border-2 border-white dark:border-neutral-900 whitespace-nowrap">
          Wrong Route 🗺️
        </div>
      </div>

      {/* Message */}
      {/* ⚠️ এখানে title টোকেন ব্যবহার করা হয়েছে */}
      <h2 className={`mt-10 text-3xl font-extrabold md:text-5xl tracking-tight ${title}`}>
        Page Not Found!
      </h2>
      
      {/* ⚠️ এখানে text টোকেন ব্যবহার করা হয়েছে */}
      <p className={`mt-4 text-base md:text-lg max-w-md mx-auto font-light leading-relaxed ${text}`}>
        Oops! The page you are looking for has been moved or doesn't exist. Let's get you back on track to booking your tickets.
      </p>

      {/* Go Back Home Button */}
      {/* ⚠️ এখানে buttonPrimary টোকেন ব্যবহার করা হয়েছে */}
      <Link
        href="/"
        className={`mt-8 inline-flex items-center justify-center px-8 py-3.5 text-base rounded-xl shadow-lg shadow-indigo-600/10 hover:opacity-95 transition-all duration-300 transform hover:-translate-y-0.5 ${buttonPrimary}`}
      >
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;