"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { card, text, title, muted } from "@/styles/ui";
import toast from 'react-hot-toast';

const AdminTicketManagePage = () => {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  // সব টিকিট লোড করার ফাংশন
  const fetchTickets = async () => {
    try {
      const res = await fetch(`${serverUrl}/admin/all-tickets`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (error) {
      console.error("Error fetching admin tickets:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // স্ট্যাটাস আপডেট করার ফাংশন
  const handleStatusUpdate = async (id, newStatus) => {
    setLoadingId(id + '-' + newStatus);
    try {
      const res = await fetch(`${serverUrl}/admin/tickets/status/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ verificationStatus: newStatus }),
      });

      if (res.ok) {
        toast.success(`Ticket successfully ${newStatus}!`);
        fetchTickets(); 
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoadingId(null); 
    }
  };

  // স্ট্যাটাস ব্যাজের জন্য ক্লাসের হেল্পার ফাংশন
  const getStatusBadgeClass = (status) => {
    const currentStatus = status?.toLowerCase() || 'pending';
    if (currentStatus === 'approved') {
      return 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400';
    }
    if (currentStatus === 'rejected') {
      return 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400';
    }
    return 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400';
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6" style={{ fontFamily: 'sans-serif' }}>
      
      {/* হেডার সেকশন */}
      <div className="border-b border-gray-200 dark:border-neutral-800 pb-4 mb-6">
        <h1 className={`${title} text-2xl font-black m-0 mb-1`}>Manage Vendor Tickets</h1>
        <p className={`${muted} text-sm m-0 font-light`}>Approve or Reject listed tickets submitted by vendors</p>
      </div>

      {tickets.length === 0 ? (
        <div className={`${card} text-center py-12 text-sm bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-xl`}>
          No tickets found to manage.
        </div>
      ) : (
        <>
          {/* 📱 📑 মোবাইল এবং ট্যাবলেট ভিউ (Responsive Card Layout) */}
          {/* small এ ১টি কার্ড, md (ট্যাবলেট) এ ২টি করে কার্ড পাশাপাশি বসবে, lg এ লুকিয়ে যাবে */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {tickets.map((ticket) => (
              <div 
                key={ticket._id}
                className="p-5 border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* টিকিট ইমেজ ও টাইটেল */}
                  <div className="flex items-center gap-3">
                    {ticket.image && (
                      <img 
                        src={ticket.image} 
                        className="w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-neutral-800 shrink-0" 
                        alt="" 
                      />
                    )}
                    <div className="min-w-0">
                      <h4 className={`font-bold text-base truncate ${title}`}>{ticket.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-neutral-400 font-medium mt-0.5">
                        {ticket.fromLocation} ➔ {ticket.toLocation}
                      </p>
                    </div>
                  </div>

                  {/* প্রাইস, কোয়ান্টিটি ও স্ট্যাটাস গ্রিড */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-50 dark:border-neutral-800/40 text-xs">
                    <div>
                      <p className="text-gray-400 font-medium">Price</p>
                      <p className={`font-bold text-sm mt-0.5 ${title}`}>৳{ticket.price}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Quantity</p>
                      <p className={`font-bold text-sm mt-0.5 ${text}`}>{ticket.quantity} Pcs</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 font-medium mb-1">Status</p>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide inline-block ${getStatusBadgeClass(ticket.verificationStatus)}`}>
                        {ticket.verificationStatus || 'pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ভেন্ডর ইনফো এবং অ্যাকশন বাটন */}
                <div className="space-y-3 pt-3 border-t border-gray-50 dark:border-neutral-800/40">
                  <div className="bg-gray-50/50 dark:bg-neutral-800/20 p-2.5 rounded-xl">
                    <p className="text-[10px] text-purple-500 font-bold uppercase tracking-wider">Vendor</p>
                    <p className={`font-semibold text-xs mt-0.5 ${text}`}>{ticket.vendorName}</p>
                    <p className={`${muted} text-[11px] truncate`}>{ticket.vendorEmail}</p>
                  </div>

                  {/* মোবাইল ও ট্যাবলেট অ্যাকশন বাটনগ্রুপ */}
                  <div className="flex gap-2 justify-end w-full">
                    <button
                      disabled={ticket.verificationStatus === 'approved' || loadingId !== null}
                      onClick={() => handleStatusUpdate(ticket._id, 'approved')}
                      className="flex-1 sm:flex-none text-center bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm"
                    >
                      {loadingId === `${ticket._id}-approved` ? '...' : 'Approve'}
                    </button>

                    <button
                      disabled={ticket.verificationStatus === 'rejected' || loadingId !== null}
                      onClick={() => handleStatusUpdate(ticket._id, 'rejected')}
                      className="flex-1 sm:flex-none text-center bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm"
                    >
                      {loadingId === `${ticket._id}-rejected` ? '...' : 'Reject'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 💻 ডেস্কটপ ভিউ (Premium Table Layout) - শুধুমাত্র 'lg' এবং তার বড় স্ক্রিনের জন্য */}
          <div className={`${card} hidden lg:block overflow-x-auto shadow-md rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900`}>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-50/70 dark:bg-neutral-950 border-b border-gray-100 dark:border-neutral-800 text-xs uppercase tracking-wider font-bold text-gray-600 dark:text-neutral-400">
                  <th className="p-4">Ticket Title</th>
                  <th className="p-4">Route</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Qty</th>
                  <th className="p-4">Vendor</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
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

                    {/* Quantity */}
                    <td className="p-4 font-medium">{ticket.quantity} Pcs</td>

                    {/* Vendor Details */}
                    <td className="p-4">
                      <div className="text-xs">
                        <p className={`font-bold ${text} m-0`}>{ticket.vendorName}</p>
                        <p className={`${muted} m-0 mt-0.5 font-light`}>{ticket.vendorEmail}</p>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusBadgeClass(ticket.verificationStatus)}`}>
                        {ticket.verificationStatus || 'pending'}
                      </span>
                    </td>

                    {/* Buttons */}
                    <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center items-center">
                        <button
                          disabled={ticket.verificationStatus === 'approved' || loadingId !== null}
                          onClick={() => handleStatusUpdate(ticket._id, 'approved')}
                          className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-semibold text-xs px-3 py-2 rounded-lg transition-colors active:scale-95"
                        >
                          {loadingId === `${ticket._id}-approved` ? '...' : 'Approve'}
                        </button>

                        <button
                          disabled={ticket.verificationStatus === 'rejected' || loadingId !== null}
                          onClick={() => handleStatusUpdate(ticket._id, 'rejected')}
                          className="bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white font-semibold text-xs px-3 py-2 rounded-lg transition-colors active:scale-95"
                        >
                          {loadingId === `${ticket._id}-rejected` ? '...' : 'Reject'}
                        </button>
                      </div>
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

export default AdminTicketManagePage;