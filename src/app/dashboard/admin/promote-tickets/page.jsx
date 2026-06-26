"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { card, text, title, muted } from "@/styles/ui";
import toast from 'react-hot-toast';

const AdminAdvertiseTicketsPage = () => {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  // ১. শুধুমাত্র Admin Approved টিকিটগুলো লোড করার ফাংশন
  const fetchApprovedTickets = async () => {
    try {
      const res = await fetch(`${serverUrl}/admin/all-tickets`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const approvedOnly = data.filter(ticket => ticket.verificationStatus?.toLowerCase() === 'approved');
        setTickets(approvedOnly);
      }
    } catch (error) {
      console.error("Error fetching approved tickets:", error);
    }
  };

  useEffect(() => {
    fetchApprovedTickets();
  }, []);

  // ২. টগল বাটন হ্যান্ডেল করার ফাংশন (Advertise / Unadvertise)
  const handleAdvertiseToggle = async (id, currentAdvertiseStatus) => {
    const nextStatus = !currentAdvertiseStatus;
    setLoadingId(id);
    
    try {
      const res = await fetch(`${serverUrl}/admin/tickets/advertise/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAdvertised: nextStatus }),
      });

      const responseData = await res.json();

      if (res.ok) {
        toast.success(responseData.message || "Status updated successfully!");
        fetchApprovedTickets(); // রিয়েল-টাইম স্টেট আপডেট
      } else {
        toast.error(responseData.message || "Failed to update advertisement status.");
      }
    } catch (error) {
      console.error("Advertise toggle error:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6" style={{ fontFamily: 'sans-serif' }}>
      
      {/* হেডার সেকশন */}
      <div className="border-b border-gray-200 dark:border-neutral-800 pb-4 mb-6">
        <h1 className={`${title} text-2xl font-black m-0 mb-1`}>Advertise Tickets</h1>
        <p className={`${muted} text-sm m-0 font-light`}>Promote tickets to the homepage (Maximum 6 tickets limits)</p>
      </div>

      {tickets.length === 0 ? (
        <div className={`${card} text-center py-12 text-sm bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-xl`}>
          No approved tickets available to advertise.
        </div>
      ) : (
        <>
          {/* 📱 মোবাইল এবং ট্যাবলেট ভিউ (Card Layout) - 'md' স্ক্রিনের নিচে দেখাবে */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {tickets.map((ticket) => (
              <div 
                key={ticket._id}
                className="p-5 border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm space-y-4 relative"
              >
                {/* ইমেজ, টাইটেল ও রুট */}
                <div className="flex items-center gap-3">
                  {ticket.image && (
                    <img 
                      src={ticket.image} 
                      className="w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-neutral-800 shrink-0" 
                      alt="" 
                    />
                  )}
                  <div>
                    <h4 className={`font-bold text-base ${title}`}>{ticket.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-neutral-400 font-medium mt-0.5">
                      {ticket.fromLocation} ➔ {ticket.toLocation}
                    </p>
                  </div>
                </div>

                {/* প্রাইস ও অ্যাড স্ট্যাটাস গ্রিড */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-50 dark:border-neutral-800/40 text-xs">
                  <div>
                    <p className="text-gray-400 font-medium">Price</p>
                    <p className={`font-extrabold text-blue-600 dark:text-blue-400 text-sm mt-0.5`}>৳{ticket.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 font-medium mb-1">Ad Status</p>
                    <span 
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide inline-block
                        ${ticket.isAdvertised ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400'}`}
                    >
                      {ticket.isAdvertised ? '🎉 Advertised' : 'Not Advertised'}
                    </span>
                  </div>
                </div>

                {/* ভেন্ডর ইনফো ও অ্যাকশন বাটন */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-50 dark:border-neutral-800/40">
                  <div className="bg-gray-50/50 dark:bg-neutral-800/20 p-2.5 rounded-xl">
                    <p className="text-[10px] text-purple-500 font-bold uppercase tracking-wider">Vendor</p>
                    <p className={`font-semibold text-xs mt-0.5 ${text}`}>{ticket.vendorName}</p>
                    <p className={`${muted} text-[11px] truncate max-w-[200px]`}>{ticket.vendorEmail}</p>
                  </div>

                  {/* মোবাইল টগল বাটন */}
                  <div className="flex justify-end shrink-0">
                    <button
                      disabled={loadingId !== null}
                      onClick={() => handleAdvertiseToggle(ticket._id, ticket.isAdvertised)}
                      className={`font-bold text-xs px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm text-white
                        ${ticket.isAdvertised ? 'bg-rose-500 hover:bg-rose-600' : 'bg-blue-600 hover:bg-blue-700'} 
                        ${loadingId !== null ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {loadingId === ticket._id ? 'Updating...' : ticket.isAdvertised ? 'Unadvertise' : 'Advertise'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 💻 ডেস্কটপ ভিউ (Premium Table Layout) - 'md' এবং বড় স্ক্রিনের জন্য */}
          <div className={`${card} hidden md:block overflow-x-auto shadow-md rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900`}>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-50/70 dark:bg-neutral-950 border-b border-gray-100 dark:border-neutral-800 text-xs uppercase tracking-wider font-bold text-gray-600 dark:text-neutral-400">
                  <th className="p-4">Ticket Title</th>
                  <th className="p-4">Route</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Vendor</th>
                  <th className="p-4">Ad Status</th>
                  <th className="p-4 text-center">Toggle Advertise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-neutral-800/60">
                {tickets.map((ticket) => (
                  <tr 
                    key={ticket._id} 
                    className="hover:bg-gray-50/30 dark:hover:bg-neutral-800/10 text-sm transition-colors duration-200"
                  >
                    {/* Title & Image */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {ticket.image && (
                          <img 
                            src={ticket.image} 
                            className="w-10 h-10 rounded-lg object-cover" 
                            alt="" 
                          />
                        )}
                        <span className={`font-bold ${title}`}>{ticket.title}</span>
                      </div>
                    </td>

                    {/* Route */}
                    <td className="p-4 font-medium text-gray-600 dark:text-neutral-300">
                      {ticket.fromLocation} ➔ {ticket.toLocation}
                    </td>

                    {/* Price */}
                    <td className={`p-4 font-extrabold text-blue-600 dark:text-blue-400 text-base`}>
                      ৳{ticket.price}
                    </td>

                    {/* Vendor Details */}
                    <td className="p-4">
                      <div className="text-xs">
                        <p className={`font-bold ${text} m-0`}>{ticket.vendorName}</p>
                        <p className={`${muted} m-0 mt-0.5 font-light`}>{ticket.vendorEmail}</p>
                      </div>
                    </td>

                    {/* Advertisement Current Status Badge */}
                    <td className="p-4">
                      <span 
                        className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide
                          ${ticket.isAdvertised ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400'}`}
                      >
                        {ticket.isAdvertised ? '🎉 Advertised' : 'Not Advertised'}
                      </span>
                    </td>

                    {/* Toggle Button Action */}
                    <td className="p-4 text-center">
                      <button
                        disabled={loadingId !== null}
                        onClick={() => handleAdvertiseToggle(ticket._id, ticket.isAdvertised)}
                        className={`font-semibold text-xs px-4 py-2 rounded-lg transition-colors active:scale-95 text-white
                          ${ticket.isAdvertised ? 'bg-rose-500 hover:bg-rose-600' : 'bg-blue-600 hover:bg-blue-700'} 
                          ${loadingId !== null ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {loadingId === ticket._id ? 'Updating...' : ticket.isAdvertised ? 'Unadvertise' : 'Advertise'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAdvertiseTicketsPage;