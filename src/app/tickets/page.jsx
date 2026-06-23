"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { card, text, title, muted } from "@/styles/ui";

const AllTicketsPage = () => {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  // ১. শুধুমাত্র Admin Approved টিকিটগুলো লোড করার ফাংশন
  useEffect(() => {
    const fetchApprovedTickets = async () => {
      try {
        const res = await fetch(`${serverUrl}/admin/all-tickets`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          // শুধুমাত্র 'approved' স্ট্যাটাসের টিকিটগুলো ফিল্টার করা হচ্ছে
          const approvedOnly = data.filter(
            ticket => ticket.verificationStatus?.toLowerCase() === 'approved'
          );
          setTickets(approvedOnly);
          setFilteredTickets(approvedOnly);
        }
      } catch (error) {
        console.error("Error fetching approved tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedTickets();
  }, [serverUrl]);

  // ২. লাইভ সার্চ ফিল্টারিং (Title, From, or To Location দিয়ে সার্চ করা যাবে)
  useEffect(() => {
    const filtered = tickets.filter(ticket =>
      ticket.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.fromLocation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.toLocation?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTickets(filtered);
  }, [searchQuery, tickets]);

  if (loading) {
    return <div className="text-center py-12 text-sm text-gray-500">Loading Available Tickets...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6" style={{ fontFamily: 'sans-serif' }}>
      
      {/* হেডার এবং সার্চ বার সেকশন */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 dark:border-neutral-800 pb-4 gap-4">
        <div>
          <h1 className={`${title} text-2xl font-bold m-0`}>All Available Tickets</h1>
          <p className={`${muted} text-sm m-0 mt-1`}>Browse and book officially verified travel tickets</p>
        </div>
        
        {/* সার্চ ইনপুট */}
        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="Search by title, from or to location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 text-sm bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 dark:text-neutral-200"
          />
        </div>
      </div>

      {/* টিকিট কার্ড গ্রিড (৩-কলাম রেসপন্সিভ লেআউট) */}
      {filteredTickets.length === 0 ? (
        <div className={`${muted} text-center py-12 text-sm`}>
          No approved tickets found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map((ticket) => (
            <div 
              key={ticket._id} 
              className={`${card} flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md transition-all rounded-xl border border-gray-100 dark:border-neutral-800/60 bg-white dark:bg-neutral-900`}
            >
              
              {/* ১. ইমেজ ও ট্রান্সপোর্ট টাইপ ব্যাজ */}
              <div className="relative h-48 w-full bg-gray-100 dark:bg-neutral-800">
                {ticket.image ? (
                  <img src={ticket.image} alt={ticket.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image Available</div>
                )}
                {/* ট্রান্সপোর্ট টাইপ */}
                {ticket.transportType && (
                  <span className="absolute top-3 right-3 bg-blue-600 text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    🚌 {ticket.transportType}
                  </span>
                )}
              </div>

              {/* কার্ড বডি কন্টেন্ট */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                
                <div className="space-y-2">
                  {/* ২. টিকিট টাইটেল */}
                  <h3 className={`${title} text-lg font-bold line-clamp-1 m-0`}>
                    {ticket.title}
                  </h3>
                  
                  {/* ৩. রুট (From ➔ To) */}
                  <p className={`${text} text-sm font-medium text-gray-700 dark:text-neutral-300 m-0`}>
                    📍 <span className="font-semibold">{ticket.fromLocation}</span> ➔ <span className="font-semibold">{ticket.toLocation}</span>
                  </p>

                  {/* ⏰ ৮. ডিপার্চার ডেট এবং টাইম */}
                  {(ticket.departureDate || ticket.departureTime) && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 px-2 py-1 rounded w-fit m-0 font-medium">
                      📅 {ticket.departureDate || 'N/A'} at {ticket.departureTime || 'N/A'}
                    </p>
                  )}

                  {/* 🏷️ ৭. পার্কস (Perks) */}
                  {ticket.perks && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {(Array.isArray(ticket.perks) ? ticket.perks : ticket.perks.split(',')).map((perk, index) => (
                        <span key={index} className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-[10px] font-semibold">
                          ✓ {perk.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 💰 ৫. প্রাইস এবং 📦 ৬. কোয়ান্টিটি সেকশন */}
                <div className="flex items-center justify-between border-t border-gray-50 dark:border-neutral-800/40 pt-3">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase m-0">Price per unit</p>
                    <p className={`${title} text-xl font-extrabold text-blue-600 dark:text-blue-400 m-0`}>৳{ticket.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase m-0">Available Qty</p>
                    <p className={`${text} text-sm font-bold text-gray-800 dark:text-neutral-200 m-0`}>
                      {ticket.quantity || ticket.ticketQuantity || 0} Pcs
                    </p>
                  </div>
                </div>

                {/* 🔍 See Details বাটন */}
                <button
                  onClick={() => router.push(`/tickets/${ticket._id}`)} // রিকোয়ারমেন্ট ৫ অনুযায়ী ডায়নামিক ডিটেইলস পেজে নিয়ে যাবে
                  className="w-full py-2.5 bg-gray-950 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all shadow-sm active:scale-[0.99]"
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  See Details
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
};

export default AllTicketsPage;