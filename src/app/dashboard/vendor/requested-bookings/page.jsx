"use client";

import React, { useState, useEffect } from 'react';
import { card, text, title, muted } from "@/styles/ui";

const RequestedBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  // ১. বুকিং রিকোয়েস্টগুলো লোড করার ফাংশন
  const fetchRequestedBookings = async () => {
    try {
      const res = await fetch(`${serverUrl}/vendor/requested-bookings`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchRequestedBookings();
  }, []);

  // ২. এক্সেপ্ট এবং রিজেক্ট বাটন হ্যান্ডেল করার ফাংশন
  const handleBookingAction = async (bookingId, ticketId, bookingQuantity, action) => {
    const confirmApprove = window.confirm(`Are you sure you want to ${action} this booking request?`);
    if (!confirmApprove) return;

    setLoadingId(bookingId);
    try {
      const res = await fetch(`${serverUrl}/vendor/bookings/status/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          action: action, // 'accepted' অথবা 'rejected'
          ticketId: ticketId,
          bookingQuantity: bookingQuantity
        }),
      });

      const responseData = await res.json();

      if (res.ok) {
        alert(responseData.message);
        fetchRequestedBookings(); // রিয়েল-টাইম টেবিল রিফ্রেশ
      } else {
        alert(responseData.message || "Failed to update booking status.");
      }
    } catch (error) {
      console.error("Booking action error:", error);
      alert("Something went wrong!");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6" style={{ fontFamily: 'sans-serif' }}>
      
      {/* হেডার সেকশন */}
      <div className="border-b border-gray-200 dark:border-neutral-800 pb-4 mb-6">
        <h1 className={`${title} text-2xl m-0 mb-1`}>Requested Bookings</h1>
        <p className={`${muted} text-sm m-0`}>Review, accept or reject incoming user booking requests.</p>
      </div>

      {/* টেবিল স্ট্রাকচার */}
      <div className={`${card} overflow-x-auto shadow-md`}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr className="bg-gray-50/50 dark:bg-neutral-800/30 border-b border-gray-200 dark:border-neutral-800 text-xs uppercase tracking-wider font-semibold text-gray-600 dark:text-neutral-400">
              <th style={{ padding: '12px 16px' }}>User Info</th>
              <th style={{ padding: '12px 16px' }}>Ticket Title</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Booking Qty</th>
              <th style={{ padding: '12px 16px' }}>Total Price</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="5" className={`${muted} text-center py-8 text-sm`}>
                  No pending booking requests available.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr 
                  key={booking._id} 
                  className={`border-b border-gray-100 dark:border-neutral-800/60 hover:bg-gray-50/30 text-sm ${text}`}
                >
                  {/* ১. ইউজারের নাম ও ইমেইল */}
                  <td style={{ padding: '16px' }}>
                    <p className={`font-semibold ${title}`} style={{ margin: 0 }}>{booking.userName || 'Customer'}</p>
                    <p className={muted} style={{ margin: 0, fontSize: '12px' }}>{booking.userEmail}</p>
                  </td>

                  {/* ২. টিকিটের টাইটেল */}
                  <td style={{ padding: '16px' }} className="font-medium">
                    {booking.ticketTitle}
                  </td>

                  {/* ৩. বুকিং কোয়ান্টিটি */}
                  <td style={{ padding: '16px', textAlign: 'center' }} className={title}>
                    {booking.bookingQuantity} Pcs
                  </td>

                  {/* ৪. টোটাল প্রাইস (ইউনিক প্রাইস * কোয়ান্টিটি ব্যাকএন্ড বা বুকিং মডেলেই ক্যালকুলেট করা থাকে) */}
                  <td style={{ padding: '16px' }} className="font-bold text-blue-600 dark:text-blue-400">
                    ৳{booking.totalPrice || (booking.unitPrice * booking.bookingQuantity)}
                  </td>

                  {/* ৫. এক্সেপ্ট এবং রিজেক্ট বাটন অ্যাকশন */}
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      
                      {/* Accept Button */}
                      <button
                        disabled={loadingId !== null}
                        onClick={() => handleBookingAction(booking._id, booking.ticketId, booking.bookingQuantity, 'accepted')}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-all text-xs"
                        style={{
                          padding: '6px 14px',
                          border: 'none',
                          cursor: loadingId !== null ? 'not-allowed' : 'pointer',
                          opacity: loadingId !== null ? 0.5 : 1
                        }}
                      >
                        {loadingId === booking._id ? 'Processing...' : 'Accept'}
                      </button>

                      {/* Reject Button */}
                      <button
                        disabled={loadingId !== null}
                        onClick={() => handleBookingAction(booking._id, booking.ticketId, booking.bookingQuantity, 'rejected')}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-all text-xs"
                        style={{
                          padding: '6px 14px',
                          border: 'none',
                          cursor: loadingId !== null ? 'not-allowed' : 'pointer',
                          opacity: loadingId !== null ? 0.5 : 1
                        }}
                      >
                        Reject
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

export default RequestedBookingsPage;