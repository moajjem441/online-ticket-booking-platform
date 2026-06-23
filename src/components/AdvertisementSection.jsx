"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { card, text, title, muted } from "@/styles/ui";

const AdvertisementSection = () => {
  const router = useRouter();
  const [adTickets, setAdTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    const fetchAdvertisedTickets = async () => {
      try {
        const res = await fetch(`${serverUrl}/admin/all-tickets`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          // অ্যাডমিনের সিলেক্ট করা (isAdvertised: true) সর্বোচ্চ ৬টি টিকিট ফিল্টার
          const filteredAds = data.filter(ticket => ticket.isAdvertised === true).slice(0, 6);
          setAdTickets(filteredAds);
        }
      } catch (error) {
        console.error("Error fetching advertised tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdvertisedTickets();
  }, [serverUrl]);

  if (loading) return <div className="text-center py-10 text-sm text-gray-500">Loading Featured Offers...</div>;
  if (adTickets.length === 0) return null; // কোনো বিজ্ঞাপন না থাকলে সেকশনটি হাইড থাকবে

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6" style={{ fontFamily: 'sans-serif' }}>
      <div className="border-b border-gray-100 dark:border-neutral-800 pb-4">
        <h2 className={`${title} text-2xl font-bold m-0`}>🎉 Featured Advertisements</h2>
        <p className={`${muted} text-sm m-0 mt-1`}>Top picks verified by Admin</p>
      </div>

      {/* রেসপন্সিভ ৩-কলাম কার্ড লেআউট */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {adTickets.map((ticket) => (
          <div key={ticket._id} className={`${card} flex flex-col justify-between overflow-hidden shadow-md hover:shadow-lg transition-all rounded-xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900`}>
            
            {/* ১. ইমেজ ও ট্রান্সপোর্ট টাইপ */}
            <div className="relative h-48 w-full bg-gray-100 dark:bg-neutral-800">
              {ticket.image ? (
                <img src={ticket.image} alt={ticket.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
              )}
              {ticket.transportType && (
                <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  🚌 {ticket.transportType}
                </span>
              )}
            </div>

            {/* কার্ড বডি কন্টেন্ট */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                {/* ২. টিকিট টাইটেল */}
                <h3 className={`${title} text-lg font-bold line-clamp-1 m-0`}>{ticket.title}</h3>
                <p className="text-xs text-gray-500 dark:text-neutral-400 m-0">{ticket.fromLocation} ➔ {ticket.toLocation}</p>

                {/* ৫. পার্কস (Perks) */}
                {ticket.perks && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(Array.isArray(ticket.perks) ? ticket.perks : ticket.perks.split(',')).map((perk, index) => (
                      <span key={index} className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-[10px] font-medium">
                        ✓ {perk.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* ৩. প্রাইস এবং ৪. কোয়ান্টিটি */}
              <div className="flex items-center justify-between border-t border-gray-50 dark:border-neutral-800/40 pt-3">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase m-0">Price per unit</p>
                  <p className={`${title} text-xl font-extrabold text-blue-600 dark:text-blue-400 m-0`}>৳{ticket.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase m-0">Quantity</p>
                  <p className={`${text} text-sm font-semibold m-0`}>{ticket.quantity || ticket.ticketQuantity || 0} Pcs</p>
                </div>
              </div>

              {/* 🔍 See Details বাটন */}
              <button
                onClick={() => router.push(`/tickets/${ticket._id}`)} // রিকোয়ারমেন্ট ৫ রাউট
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all"
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

export default AdvertisementSection;