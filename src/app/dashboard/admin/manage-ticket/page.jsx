"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
        alert(`Ticket successfully ${newStatus}!`);
        fetchTickets(); 
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("Something went wrong!");
    } finally {
      setLoadingId(null); 
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: '24px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>Manage Vendor Tickets</h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Approve or Reject listed tickets submitted by vendors</p>
      </div>

      {/* প্লেইন HTML টেবিল */}
      <div style={{ overflowX: 'auto', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff', textAlgin: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', textTransform: 'uppercase', fontSize: '12px', color: '#374151', textAlign: 'left' }}>
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
                <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#9ca3af' }}>
                  No tickets found to manage.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket._id} style={{ borderBottom: '1px solid #e5e7eb', color: '#4b5563', fontSize: '14px' }}>
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
                      <span style={{ fontWeight: '500', color: '#111827' }}>{ticket.title}</span>
                    </div>
                  </td>

                  {/* Route */}
                  <td style={{ padding: '16px' }}>
                    {ticket.fromLocation} ➔ {ticket.toLocation}
                  </td>

                  {/* Price */}
                  <td style={{ padding: '16px', fontWeight: 'bold' }}>৳{ticket.price}</td>

                  {/* Quantity */}
                  <td style={{ padding: '16px' }}>{ticket.quantity} Pcs</td>

                  {/* Vendor Details */}
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '12px' }}>
                      <p style={{ margin: 0, fontWeight: '600', color: '#374151' }}>{ticket.vendorName}</p>
                      <p style={{ margin: 0, color: '#9ca3af' }}>{ticket.vendorEmail}</p>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: ticket.verificationStatus === 'approved' ? '#def7ec' : ticket.verificationStatus === 'rejected' ? '#fde8e8' : '#fef3c7',
                      color: ticket.verificationStatus === 'approved' ? '#03543f' : ticket.verificationStatus === 'rejected' ? '#9b1c1c' : '#92400e'
                    }}>
                      {ticket.verificationStatus || 'pending'}
                    </span>
                  </td>

                  {/* Buttons */}
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        disabled={ticket.verificationStatus === 'approved' || loadingId !== null}
                        onClick={() => handleStatusUpdate(ticket._id, 'approved')}
                        style={{
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: '6px',
                          backgroundColor: '#10b981',
                          color: 'white',
                          fontWeight: '600',
                          cursor: 'pointer',
                          opacity: (ticket.verificationStatus === 'approved' || loadingId !== null) ? 0.5 : 1
                        }}
                      >
                        {loadingId === `${ticket._id}-approved` ? '...' : 'Approve'}
                      </button>

                      <button
                        disabled={ticket.verificationStatus === 'rejected' || loadingId !== null}
                        onClick={() => handleStatusUpdate(ticket._id, 'rejected')}
                        style={{
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: '6px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          fontWeight: '600',
                          cursor: 'pointer',
                          opacity: (ticket.verificationStatus === 'rejected' || loadingId !== null) ? 0.5 : 1
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