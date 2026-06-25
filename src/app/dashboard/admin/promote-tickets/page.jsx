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
        toast.success(responseData.message);
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
        <h1 className={`${title} text-2xl m-0 mb-1`}>Advertise Tickets</h1>
        <p className={`${muted} text-sm m-0`}>Promote tickets to the homepage (Maximum 6 tickets limits)</p>
      </div>

      {/* টেবিল স্ট্রাকচার */}
      <div className={`${card} overflow-x-auto shadow-md`}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr className="bg-gray-50/50 dark:bg-neutral-800/30 border-b border-gray-200 dark:border-neutral-800 text-xs uppercase tracking-wider font-semibold text-gray-600 dark:text-neutral-400">
              <th style={{ padding: '12px 16px' }}>Ticket Title</th>
              <th style={{ padding: '12px 16px' }}>Route</th>
              <th style={{ padding: '12px 16px' }}>Price</th>
              <th style={{ padding: '12px 16px' }}>Vendor</th>
              <th style={{ padding: '12px 16px' }}>Ad Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Toggle Advertise</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="6" className={`${muted} text-center py-8 text-sm`}>
                  No approved tickets available to advertise.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr 
                  key={ticket._id} 
                  className={`border-b border-gray-100 dark:border-neutral-800/60 hover:bg-gray-50/30 dark:hover:bg-neutral-800/10 text-sm ${text}`}
                >
                  {/* Title & Image */}
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {ticket.image && (
                        <img 
                          src={ticket.image} 
                          style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} 
                          alt="" 
                        />
                      )}
                      <span className={title}>{ticket.title}</span>
                    </div>
                  </td>

                  {/* Route */}
                  <td style={{ padding: '16px' }}>
                    {ticket.fromLocation} ➔ {ticket.toLocation}
                  </td>

                  {/* Price */}
                  <td style={{ padding: '16px' }} className={title}>৳{ticket.price}</td>

                  {/* Vendor Details */}
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '12px' }}>
                      <p className={`font-semibold ${text}`} style={{ margin: 0 }}>{ticket.vendorName}</p>
                      <p className={muted} style={{ margin: 0 }}>{ticket.vendorEmail}</p>
                    </div>
                  </td>

                  {/* Advertisement Current Status Badge */}
                  <td style={{ padding: '16px' }}>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium tracking-wide
                        ${ticket.isAdvertised ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400'}`}
                    >
                      {ticket.isAdvertised ? '🎉 Advertised' : 'Not Advertised'}
                    </span>
                  </td>

                  {/* Toggle Button Action */}
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <button
                      // গুড প্র্যাকটিস: যেকোনো একটি বাটন লোড হলে অন্য সব বাটনও সাময়িক ডিজেবল থাকবে
                      disabled={loadingId !== null}
                      onClick={() => handleAdvertiseToggle(ticket._id, ticket.isAdvertised)}
                      className="font-semibold rounded-md transition-all text-white text-xs"
                      style={{
                        padding: '6px 14px',
                        border: 'none',
                        cursor: loadingId !== null ? 'not-allowed' : 'pointer',
                        backgroundColor: ticket.isAdvertised ? '#ef4444' : '#2563eb',
                        opacity: loadingId !== null ? 0.4 : 1
                      }}
                    >
                      {loadingId === ticket._id ? 'Updating...' : ticket.isAdvertised ? 'Unadvertise' : 'Advertise'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAdvertiseTicketsPage;