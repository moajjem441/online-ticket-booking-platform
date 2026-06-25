"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// আপনার ডিফাইন করা স্টাইল ইম্পোর্ট করা হলো
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

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6" style={{ fontFamily: 'sans-serif' }}>
      {/* হেডার সেকশন */}
      <div className="border-b border-gray-200 dark:border-neutral-800 pb-4 mb-6">
        <h1 className={`${title} text-2xl m-0 mb-1`}>Manage Vendor Tickets</h1>
        <p className={`${muted} text-sm m-0`}>Approve or Reject listed tickets submitted by vendors</p>
      </div>

      {/* আপনার 'card' স্টাইল ব্যবহার করে টেবিল কন্টেইনার */}
      <div className={`${card} overflow-x-auto shadow-md`}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            {/* হেডার রো */}
            <tr className="bg-gray-50/50 dark:bg-neutral-800/30 border-b border-gray-200 dark:border-neutral-800 text-xs uppercase tracking-wider font-semibold text-gray-600 dark:text-neutral-400">
              <th style={{ padding: '12px 16px' }}>Ticket Title</th>
              <th style={{ padding: '12px 16px' }}>Route</th>
              <th style={{ padding: '12px 16px' }}>Price</th>
              <th style={{ padding: '12px 16px' }}>Qty</th>
              <th style={{ padding: '12px 16px' }}>Vendor</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="7" className={`${muted} text-center py-8 text-sm`}>
                  No tickets found to manage.
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

                  {/* Quantity */}
                  <td style={{ padding: '16px' }}>{ticket.quantity} Pcs</td>

                  {/* Vendor Details */}
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '12px' }}>
                      <p className={`font-semibold ${text}`} style={{ margin: 0 }}>{ticket.vendorName}</p>
                      <p className={muted} style={{ margin: 0 }}>{ticket.vendorEmail}</p>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: '16px' }}>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium tracking-wide
                        ${ticket.verificationStatus === 'approved' ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400' : 
                          ticket.verificationStatus === 'rejected' ? 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400' : 
                          'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400'}`}
                    >
                      {ticket.verificationStatus || 'pending'}
                    </span>
                  </td>

                  {/* Buttons */}
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        disabled={ticket.verificationStatus === 'approved' || loadingId !== null}
                        onClick={() => handleStatusUpdate(ticket._id, 'approved')}
                        className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-semibold rounded-md transition-colors"
                        style={{
                          padding: '6px 12px',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {loadingId === `${ticket._id}-approved` ? '...' : 'Approve'}
                      </button>

                      <button
                        disabled={ticket.verificationStatus === 'rejected' || loadingId !== null}
                        onClick={() => handleStatusUpdate(ticket._id, 'rejected')}
                        className="bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white font-semibold rounded-md transition-colors"
                        style={{
                          padding: '6px 12px',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {loadingId === `${ticket._id}-rejected` ? '...' : 'Reject'}
                      </button>
                    </div>
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

export default AdminTicketManagePage;