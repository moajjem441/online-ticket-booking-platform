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

  // 2. Handle accept/reject
  const handleBookingAction = async (bookingId, ticketId, bookingQuantity, action) => {
    setLoadingId(bookingId);
    try {
      const res = await fetch(`${serverUrl}/vendor/bookings/status/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          action: action, 
          ticketId: ticketId,
          bookingQuantity: bookingQuantity
        }),
      });

      const responseData = await res.json();

      if (res.ok) {
        toast.success(responseData.message || `Booking request ${action} successfully!`);
        fetchRequestedBookings(); 
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
      
      {/* Header Section */}
      <div className="border-b border-gray-200 dark:border-neutral-800 pb-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white m-0 mb-1">
          Requested <span className="bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">Bookings</span>
        </h1>
        <p className={`${muted} text-xs md:text-sm m-0 mt-1 font-light`}>
          Review, accept or reject incoming user booking requests.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className={`${card} text-center py-12 text-sm font-light bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-xl`}>
          No pending booking requests available.
        </div>
      ) : (
        <>
          {/* 📱 মোবাইল এবং ট্যাবলেট ভিউ (Responsive Card Layout) - 'md' স্ক্রিনের নিচে দেখাবে */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {bookings.map((booking) => (
              <div 
                key={booking._id}
                className="p-5 border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm space-y-4 relative"
              >
                {/* কাস্টমার ইনফো */}
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-purple-500 bg-purple-50 dark:bg-purple-950/30 px-2 py-0.5 rounded-md">
                    Customer Info
                  </span>
                  <h4 className="font-bold text-gray-900 dark:text-neutral-100 text-base mt-1.5">
                    {booking.userName || 'Customer'}
                  </h4>
                  <p className="text-gray-500 dark:text-neutral-400 text-xs font-light">
                    {booking.userEmail}
                  </p>
                </div>

                {/* টিকিট ও কোয়ান্টিটি গ্রিড */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-50 dark:border-neutral-800/40">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Ticket / Route</p>
                    <p className="font-semibold text-gray-800 dark:text-neutral-200 text-sm mt-0.5">
                      {booking.ticketTitle}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-medium">Quantity</p>
                    <p className="font-black text-gray-900 dark:text-white text-sm mt-0.5">
                      {booking.bookingQuantity} <span className="text-xs font-normal text-gray-500">Pcs</span>
                    </p>
                  </div>
                </div>

                {/* প্রাইস এবং অ্যাকশন বাটন সেকশন */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-neutral-800/40">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Total Price</p>
                    <p className="font-extrabold text-blue-600 dark:text-blue-400 text-lg">
                      ৳{booking.totalPrice || (booking.unitPrice * booking.bookingQuantity)}
                    </p>
                  </div>

                  {/* মোবাইল অ্যাকশন বাটনসমূহ */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      disabled={loadingId !== null}
                      onClick={() => handleBookingAction(booking._id, booking.ticketId, booking.bookingQuantity, 'accepted')}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all active:scale-95"
                    >
                      {loadingId === booking._id ? '...' : 'Accept'}
                    </button>
                    <button
                      disabled={loadingId !== null}
                      onClick={() => handleBookingAction(booking._id, booking.ticketId, booking.bookingQuantity, 'rejected')}
                      className="bg-rose-600 hover:bg-rose-700 disabled:bg-rose-600/50 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all active:scale-95"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 💻 ডেস্কটপ ভিউ (Premium Table Layout) - মাঝারি এবং বড় স্ক্রিনের জন্য */}
          <div className={`${card} hidden md:block overflow-x-auto shadow-md rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900`}>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-50/70 dark:bg-neutral-950 border-b border-gray-100 dark:border-neutral-800 text-xs uppercase tracking-wider font-bold text-gray-600 dark:text-neutral-400">
                  <th className="p-4">User Info</th>
                  <th className="p-4">Ticket Title</th>
                  <th className="p-4 text-center">Booking Qty</th>
                  <th className="p-4">Total Price</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-neutral-800/60">
                {bookings.map((booking) => (
                  <tr 
                    key={booking._id} 
                    className="hover:bg-gray-50/40 dark:hover:bg-neutral-800/20 text-sm transition-colors duration-200"
                  >
                    {/* User Info */}
                    <td className="p-4">
                      <p className="font-bold text-gray-900 dark:text-neutral-100 m-0">
                        {booking.userName || 'Customer'}
                      </p>
                      <p className="text-gray-500 dark:text-neutral-400 m-0 text-xs mt-0.5 font-light">
                        {booking.userEmail}
                      </p>
                    </td>

                    {/* Ticket Title */}
                    <td className="p-4 font-semibold text-gray-800 dark:text-neutral-200">
                      {booking.ticketTitle}
                    </td>

                    {/* Booking Qty */}
                    <td className="p-4 text-center font-black text-gray-900 dark:text-white">
                      {booking.bookingQuantity} <span className="text-xs font-normal text-gray-500">Pcs</span>
                    </td>

                    {/* Total Price */}
                    <td className="p-4 font-extrabold text-blue-600 dark:text-blue-400 text-base">
                      ৳{booking.totalPrice || (booking.unitPrice * booking.bookingQuantity)}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center items-center">
                        <button
                          disabled={loadingId !== null}
                          onClick={() => handleBookingAction(booking._id, booking.ticketId, booking.bookingQuantity, 'accepted')}
                          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-sm active:scale-95"
                          style={{ border: 'none', cursor: loadingId !== null ? 'not-allowed' : 'pointer' }}
                        >
                          {loadingId === booking._id ? 'Processing...' : 'Accept'}
                        </button>
                        <button
                          disabled={loadingId !== null}
                          onClick={() => handleBookingAction(booking._id, booking.ticketId, booking.bookingQuantity, 'rejected')}
                          className="bg-rose-600 hover:bg-rose-700 disabled:bg-rose-600/50 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-sm active:scale-95"
                          style={{ border: 'none', cursor: loadingId !== null ? 'not-allowed' : 'pointer' }}
                        >
                          Reject
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

export default RequestedBookingsPage;