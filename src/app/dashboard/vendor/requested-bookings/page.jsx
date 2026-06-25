"use client";

import React, { useState, useEffect } from 'react';
import { card, text, title, muted } from "@/styles/ui";
import toast from 'react-hot-toast';

const RequestedBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  // 1. Fetch booking requests from server
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

  // 2. Handle accept/reject with custom stylized toasts instead of default alert windows
  const handleBookingAction = async (bookingId, ticketId, bookingQuantity, action) => {
    setLoadingId(bookingId);
    try {
      const res = await fetch(`${serverUrl}/vendor/bookings/status/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          action: action, // 'accepted' or 'rejected'
          ticketId: ticketId,
          bookingQuantity: bookingQuantity
        }),
      });

      const responseData = await res.json();

      if (res.ok) {
        toast.success(responseData.message || `Booking request ${action} successfully!`);
        fetchRequestedBookings(); // Real-time table refresh
      } else {
        toast.error(responseData.message || "Failed to update booking status.");
      }
    } catch (error) {
      console.error("Booking action error:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6" style={{ fontFamily: 'sans-serif' }}>
      
      {/* Header Section with Banner Styling */}
      <div className="border-b border-gray-200 dark:border-neutral-800 pb-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white m-0 mb-1">
          Requested <span className="bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">Bookings</span>
        </h1>
        <p className={`${muted} text-xs md:text-sm m-0 mt-1 font-light`}>
          Review, accept or reject incoming user booking requests.
        </p>
      </div>

      {/* Table Canvas with Premium Cards Look */}
      <div className={`${card} overflow-x-auto shadow-md rounded-xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900`}>
        <table className="w-full border-collapse text-left min-w-[800px]">
          <thead>
            <tr className="bg-gray-50/70 dark:bg-neutral-800/30 border-b border-gray-100 dark:border-neutral-800 text-xs uppercase tracking-wider font-bold text-gray-700 dark:text-neutral-400">
              <th className="p-4">User Info</th>
              <th className="p-4">Ticket Title</th>
              <th className="p-4 text-center">Booking Qty</th>
              <th className="p-4">Total Price</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="5" className={`${muted} text-center py-12 text-sm font-light`}>
                  No pending booking requests available.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr 
                  key={booking._id} 
                  className="border-b border-gray-100 dark:border-neutral-800/60 hover:bg-gray-50/40 dark:hover:bg-neutral-800/20 text-sm transition-colors duration-200"
                >
                  {/* 1. User Info (Optimized Visibility for Light/Dark Mode) */}
                  <td className="p-4">
                    <p className="font-bold text-gray-900 dark:text-neutral-100 m-0">
                      {booking.userName || 'Customer'}
                    </p>
                    <p className="text-gray-500 dark:text-neutral-400 m-0 text-xs mt-0.5 font-light">
                      {booking.userEmail}
                    </p>
                  </td>

                  {/* 2. Ticket Title */}
                  <td className="p-4 font-semibold text-gray-800 dark:text-neutral-200">
                    {booking.ticketTitle}
                  </td>

                  {/* 3. Booking Quantity */}
                  <td className="p-4 text-center font-black text-gray-900 dark:text-white">
                    {booking.bookingQuantity} <span className="text-xs font-normal text-gray-500">Pcs</span>
                  </td>

                  {/* 4. Total Price */}
                  <td className="p-4 font-extrabold text-blue-600 dark:text-blue-400 text-base">
                    ৳{booking.totalPrice || (booking.unitPrice * booking.bookingQuantity)}
                  </td>

                  {/* 5. Accept and Reject Actions */}
                  <td className="p-4 text-center">
                    <div className="flex gap-2 justify-center items-center">
                      
                      {/* Accept Button */}
                      <button
                        disabled={loadingId !== null}
                        onClick={() => handleBookingAction(booking._id, booking.ticketId, booking.bookingQuantity, 'accepted')}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-sm shadow-emerald-600/10"
                        style={{ border: 'none', cursor: loadingId !== null ? 'not-allowed' : 'pointer' }}
                      >
                        {loadingId === booking._id ? 'Processing...' : 'Accept'}
                      </button>

                      {/* Reject Button */}
                      <button
                        disabled={loadingId !== null}
                        onClick={() => handleBookingAction(booking._id, booking.ticketId, booking.bookingQuantity, 'rejected')}
                        className="bg-rose-600 hover:bg-rose-700 disabled:bg-rose-600/50 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-sm shadow-rose-600/10"
                        style={{ border: 'none', cursor: loadingId !== null ? 'not-allowed' : 'pointer' }}
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