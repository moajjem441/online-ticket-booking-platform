"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { card, text, title, muted } from "@/styles/ui";
import { authClient } from '@/lib/auth-client';

import toast from 'react-hot-toast';

const TicketDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingQty, setBookingQty] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  
  // কাউন্টডাউন স্টেট
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  // ডামি ইউজার ডেটা (রিয়েল অ্যাপে এটি আপনার Auth Context বা সেসশন থেকে আসবে)

  const {data:cutrrentUser}=  authClient.useSession();
  const user=cutrrentUser?.user;
  const currentUser = { name: user?.name, email: user?.email };
  // const currentUser = { name: "Moajjem Hossain", email: "moajjem@example.com" }; 

  // ১. টিকিটের ডিটেইলস ডেটা লোড করা
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const res = await fetch(`${serverUrl}/admin/all-tickets`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const foundTicket = data.find(t => t._id === id);
          setTicket(foundTicket);
        }
      } catch (error) {
        console.error("Error fetching ticket details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTicketDetails();
  }, [id, serverUrl]);

  // ২. লাইভ কাউন্টডাউন টাইমার ইফেক্ট
  useEffect(() => {
    if (!ticket || !ticket.departureDate) return;

    const interval = setInterval(() => {
      // ডিপার্চার ডেট এবং টাইম কম্বাইন করা (Format: YYYY-MM-DD THH:mm)
      const departureDateTimeStr = `${ticket.departureDate}T${ticket.departureTime || "00:00"}`;
      const targetTime = new Date(departureDateTimeStr).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setCountdown(prev => ({ ...prev, isExpired: true }));
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setCountdown({ days, hours, minutes, seconds, isExpired: false });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [ticket]);

  // ৩. বুকিং ফর্ম সাবমিট হ্যান্ডেলার
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const availableQty = ticket.quantity || ticket.ticketQuantity || 0;

    // ভ্যালিডেশন: বুকিং কোয়ান্টিটি যেন এভেইলেবল কোয়ান্টিটির চেয়ে বড় না হয়
    if (parseInt(bookingQty) > availableQty) {
      toast.error(`Booking quantity cannot be greater than available Ticket Quantity (${availableQty} Pcs)!`);
      return;
    }

    if (parseInt(bookingQty) <= 0) {
      toast.error("Please enter a valid booking quantity.");
      return;
    }

    setSubmitting(true);

    const bookingData = {
      ticketId: ticket._id,
      ticketTitle: ticket.title,
      userName: currentUser.name,
      userEmail: currentUser.email,
      bookingQuantity: parseInt(bookingQty),
      unitPrice: ticket.price,
      totalPrice: ticket.price * parseInt(bookingQty),
    

      fromLocation: ticket.fromLocation,
  toLocation: ticket.toLocation,
  departureDate: ticket.departureDate,
  departureTime: ticket.departureTime || "00:00", // যদি নাল থাকে তবে ফ্যালব্যাক দিন
  image: ticket.image || "", 

    status: "pending" // রিকোয়ারমেন্ট অনুযায়ী Pending স্ট্যাটাস
    };

    try {
      const res = await fetch(`${serverUrl}/bookings/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });

      if (res.ok) {
        toast.success("Booking request submitted successfully!");
        setIsModalOpen(false);
        router.push('/dashboard/user/my-bookings'); // সরাসরি My Booked Tickets পেজে নিয়ে যাবে
      } else {
        toast.error("Failed to confirm booking.");
      }
    } catch (error) {
      console.error("Booking submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-sm text-gray-500">Loading Details...</div>;
  if (!ticket) return <div className="text-center py-12 text-sm text-red-500">Ticket not found!</div>;

  const totalAvailable = ticket.quantity || ticket.ticketQuantity || 0;
  const isButtonDisabled = countdown.isExpired || totalAvailable === 0;

  return (
    <div className="w-full mt-30 max-w-4xl mx-auto p-4 md:p-6 space-y-6" style={{ fontFamily: 'sans-serif' }}>
      
      {/* মেইন কন্টেইনার কার্ড */}
      <div className={`${card} overflow-hidden border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6 p-6`}>
        
        {/* বাম পাশ: ইমেজ সেকশন */}
        <div className="relative h-64 md:h-full min-h-[250px] w-full bg-gray-50 dark:bg-neutral-800 rounded-lg overflow-hidden">
          {ticket.image ? (
            <img src={ticket.image} alt={ticket.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No Image Available</div>
          )}
        </div>

        {/* ডান পাশ: টিকিটের পূর্ণাঙ্গ তথ্য */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div>
              <span className="bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
                🚌 {ticket.transportType || "Transport"}
              </span>
              <h1 className={`${title} text-2xl font-black mt-2 m-0`}>{ticket.title}</h1>
            </div>

            <p className={`${text} text-sm m-0 font-medium`}>
              📍 Route: <span className="font-bold">{ticket.fromLocation}</span> ➔ <span className="font-bold">{ticket.toLocation}</span>
            </p>

            {/* ⏰ লাইভ কাউন্টডাউন ডিসপ্লে */}
            <div className="p-3 bg-gray-50 dark:bg-neutral-800/50 rounded-lg border border-gray-100 dark:border-neutral-800/50">
              <p className="text-[11px] uppercase tracking-wider text-gray-400 m-0 font-semibold">Time Remaining to Departure</p>
              {countdown.isExpired ? (
                <p className="text-sm font-bold text-red-500 m-0 mt-1">🚨 Departure time has passed!</p>
              ) : (
                <p className={`${title} text-base font-bold text-orange-600 dark:text-orange-400 m-0 mt-1`}>
                  ⏳ {countdown.days}d : {countdown.hours}h : {countdown.minutes}m : {countdown.seconds}s
                </p>
              )}
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p style={{ margin: 0 }}>📅 **Departure Date:** {ticket.departureDate}</p>
              <p style={{ margin: 0 }}>⏰ **Departure Time:** {ticket.departureTime || "Not Specified"}</p>
            </div>

            {/* Perks */}
            {ticket.perks && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(Array.isArray(ticket.perks) ? ticket.perks : ticket.perks.split(',')).map((perk, index) => (
                  <span key={index} className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-[11px] font-medium">
                    ✓ {perk.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* প্রাইস, এভেইলেবল কোয়ান্টিটি এবং বুক নাও বাটন */}
          <div className="border-t border-gray-100 dark:border-neutral-800/60 pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 uppercase m-0">Price per ticket</p>
                <p className={`${title} text-2xl font-black text-blue-600 dark:text-blue-400 m-0`}>৳{ticket.price}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase m-0">Available Stock</p>
                <p className={`${text} text-sm font-bold m-0`}>
                  {totalAvailable === 0 ? "⚠️ Sold Out" : `${totalAvailable} Pcs`}
                </p>
              </div>
            </div>

            {/* Book Now বাটন (ডিজেবল মেকানিজম সহ) */}
            <button
              disabled={isButtonDisabled}
              onClick={() => setIsModalOpen(true)}
              className={`w-full py-3 font-bold rounded-xl text-sm text-white transition-all shadow-md
                ${isButtonDisabled 
                  ? 'bg-gray-300 dark:bg-neutral-800 text-gray-400 dark:text-neutral-600 cursor-not-allowed shadow-none' 
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99]'}`}
              style={{ border: 'none', cursor: isButtonDisabled ? 'not-allowed' : 'pointer' }}
            >
              {totalAvailable === 0 ? "Sold Out" : countdown.isExpired ? "Booking Closed" : "Book Now"}
            </button>
          </div>

        </div>
      </div>

      {/* 🧾 ৪. বুকিং ইনপুট মডাল (Booking Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`${card} w-full max-w-md bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 p-6 rounded-2xl shadow-2xl space-y-4`}>
            
            <div className="border-b border-gray-50 dark:border-neutral-800/60 pb-2 flex justify-between items-center">
              <h3 className={`${title} text-lg font-bold m-0`}>Confirm Booking</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 bg-transparent border-none text-xl font-bold cursor-pointer"
              >✕</button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 m-0 mb-1">Ticket: <b>{ticket.title}</b></p>
                <p className="text-xs text-gray-500 m-0 mb-3">Max Available: <span className="text-blue-600 font-bold">{totalAvailable} Pcs</span></p>
                
                <label className="block text-xs font-semibold text-gray-600 dark:text-neutral-400 mb-1">
                  Enter Booking Quantity:
                </label>
                <input
                  type="number"
                  min="1"
                  max={totalAvailable}
                  value={bookingQty}
                  onChange={(e) => setBookingQty(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-lg text-sm text-gray-800 dark:text-neutral-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* টোটাল প্রাইস লাইভ হিসাব */}
              <div className="bg-blue-50/50 dark:bg-blue-950/20 p-3 rounded-lg flex justify-between items-center text-xs">
                <span className="text-gray-500">Estimated Total:</span>
                <span className={`${title} text-base font-bold text-blue-600 dark:text-blue-400`}>
                  ৳{ticket.price * (parseInt(bookingQty) || 0)}
                </span>
              </div>

              {/* অ্যাকশন বাটনসমূহ */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-700 dark:text-neutral-200 font-semibold rounded-lg text-xs"
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs disabled:opacity-50"
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  {submitting ? "Saving..." : "Confirm & Request"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default TicketDetailsPage;