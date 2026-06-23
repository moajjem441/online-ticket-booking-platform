"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { card, text, title, muted } from "@/styles/ui";

const LatestTicketsSection = () => {
  const router = useRouter();
  const [latestTickets, setLatestTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    const fetchLatestTickets = async () => {
      try {
        // সব টিকিট নিয়ে আসার এপিআই কল করা হচ্ছে
        const res = await fetch(`${serverUrl}/admin/all-tickets`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          
          // ১. টিকিটগুলোকে উল্টো করে সাজানো হচ্ছে (যাতে একদম নতুন যোগ করা টিকিটগুলো সবার আগে আসে)
          // ২. .slice(0, 8) দিয়ে শুধুমাত্র লেটেস্ট ৬ থেকে ৮টি টিকিট সিলেক্ট করা হচ্ছে
          const sortedLatest = [...data].reverse().slice(0, 8);
          
          setLatestTickets(sortedLatest);
        }
      } catch (error) {
        console.error("Error fetching latest tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestTickets();
  }, [serverUrl]);

  if (loading) return <div className="text-center py-10 text-sm text-gray-500">Loading Latest Tickets...</div>;
  if (latestTickets.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6" style={{ fontFamily: 'sans-serif' }}>
      
      {/* সেকশন হেডার */}
      <div className="border-b border-gray-100 dark:border-neutral-800 pb-4">
        <h2 className={`${title} text-2xl font-bold m-0`}>🆕 Recently Added Tickets</h2>
        <p className={`${muted} text-sm m-0 mt-1`}>Explore the latest available travel tickets listed just now</p>
      </div>

      {/* রেসপন্সিভ কার্ড গ্রিড লেআউট (মোবাইলে ১টি, ট্যাবে ২টি, ল্যাপটপে ৩/৪টি কলাম) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {latestTickets.map((ticket) => (
          <div 
            key={ticket._id} 
            className={`${card} flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md transition-all rounded-xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900`}
          >
            
            {/* ১. ইমেজ ও ট্রান্সপোর্ট টাইপ ব্যাজ */}
            <div className="relative h-44 w-full bg-gray-100 dark:bg-neutral-800">
              {ticket.image ? (
                <img src={ticket.image} alt={ticket.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
              )}
              {ticket.transportType && (
                <span className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow">
                  {ticket.transportType}
                </span>
              )}
            </div>

            {/* কার্ড বডি কন্টেন্ট */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              
              <div className="space-y-1.5">
                {/* ২. টিকিট টাইটেল */}
                <h3 className={`${title} text-base font-bold line-clamp-1 m-0`}>
                  {ticket.title}
                </h3>
                
                {/* রুট */}
                <p className="text-xs text-gray-400 m-0">
                  {ticket.fromLocation} ➔ {ticket.toLocation}
                </p>

                {/* ৫. পার্কস (Perks) */}
                {ticket.perks && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {(Array.isArray(ticket.perks) ? ticket.perks : ticket.perks.split(',')).slice(0, 2).map((perk, index) => (
                      <span key={index} className="bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 px-1.5 py-0.5 rounded text-[10px] font-medium">
                        ✓ {perk.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* ৩. প্রাইস এবং ৪. কোয়ান্টিটি */}
              <div className="flex items-center justify-between border-t border-gray-50 dark:border-neutral-800/40 pt-2.5">
                <div>
                  <p className="text-[9px] text-gray-400 uppercase m-0">Price</p>
                  <p className={`${title} text-base font-extrabold text-blue-600 dark:text-blue-400 m-0`}>৳{ticket.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-gray-400 uppercase m-0">Available</p>
                  <p className={`${text} text-xs font-semibold m-0`}>{ticket.quantity || ticket.ticketQuantity || 0} Pcs</p>
                </div>
              </div>

              {/* 🔍 See Details বাটন */}
              <button
                onClick={() => router.push(`/tickets/${ticket._id}`)} // রিকোয়ারমেন্ট ৫ ডাইনামিক রাউট
                className="w-full py-2 bg-gray-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium rounded-lg text-xs transition-all"
                style={{ border: 'none', cursor: 'pointer' }}
              >
                See Details
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestTicketsSection;