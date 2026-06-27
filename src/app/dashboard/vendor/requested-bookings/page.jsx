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
    setLoadingId(bookingId + '-' + action);
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
          {/* 📱 📑 মোবাইল এবং ট্যাবলেট ভিউ (Responsive Card Layout) */}
          {/* মোবাইলে ১টি করে এবং ট্যাবলেটে (md) ২টি করে কার্ড পাশাপাশি বসবে। ডেস্কটপে (lg) হাইড থাকবে */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {bookings.map((booking) => (
              <div 
                key={booking._id}
                className="p-5 border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* কাস্টমার ইনফো */}
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-purple-500 bg-purple-50 dark:bg-purple-950/30 px-2 py-0.5 rounded-md inline-block">
                      Customer Info
                    </span>
                    <h4 className={`font-bold text-base mt-1.5 truncate ${title}`}>
                      {booking.userName || 'Customer'}
                    </h4>
                    <p className={`${muted} text-xs font-light truncate`}>
                      {booking.userEmail}
                    </p>
                  </div>

                  {/* টিকিট ও কোয়ান্টিটি গ্রিড */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-50 dark:border-neutral-800/40">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 font-medium">Ticket / Route</p>
                      <p className={`font-semibold text-sm mt-0.5 truncate ${text}`}>
                        {booking.ticketTitle}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-medium">Quantity</p>
                      <p className={`font-black text-sm mt-0.5 ${title}`}>
                        {booking.bookingQuantity} <span className="text-xs font-normal text-gray-500">Pcs</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* প্রাইস এবং অ্যাকশন বাটন সেকশন */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-50 dark:border-neutral-800/40">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Total Price</p>
                    <p className="font-extrabold text-blue-600 dark:text-blue-400 text-lg">
                      ৳{booking.totalPrice || (booking.unitPrice * booking.bookingQuantity)}
                    </p>
                  </div>

                  {/* মোবাইল ও ট্যাবলেট অ্যাকশন বাটনসমূহ */}
                  <div className="flex gap-2 justify-end w-full sm:w-auto shrink-0">
                    <button
                      disabled={loadingId !== null}
                      onClick={() => handleBookingAction(booking._id, booking.ticketId, booking.bookingQuantity, 'accepted')}
                      className="flex-1 sm:flex-none text-center bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm"
                    >
                      {loadingId === `${booking._id}-accepted` ? '...' : 'Accept'}
                    </button>
                    <button
                      disabled={loadingId !== null}
                      onClick={() => handleBookingAction(booking._id, booking.ticketId, booking.bookingQuantity, 'rejected')}
                      className="flex-1 sm:flex-none text-center bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm"
                    >
                      {loadingId === `${booking._id}-rejected` ? '...' : 'Reject'}
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
                      <div className="min-w-0">
                        <p className={`font-bold m-0 ${title}`}>
                          {booking.userName || 'Customer'}
                        </p>
                        <p className={`m-0 text-xs mt-0.5 font-light ${muted}`}>
                          {booking.userEmail}
                        </p>
                      </div>
                    </td>

                    {/* Ticket Title */}
                    <td className={`p-4 font-semibold ${text}`}>
                      {booking.ticketTitle}
                    </td>

                    {/* Booking Qty */}
                    <td className={`p-4 text-center font-black ${title}`}>
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
                          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors active:scale-95 shadow-sm"
                        >
                          {loadingId === `${booking._id}-accepted` ? '...' : 'Accept'}
                        </button>
                        <button
                          disabled={loadingId !== null}
                          onClick={() => handleBookingAction(booking._id, booking.ticketId, booking.bookingQuantity, 'rejected')}
                          className="bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors active:scale-95 shadow-sm"
                        >
                          {loadingId === `${booking._id}-rejected` ? '...' : 'Reject'}
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