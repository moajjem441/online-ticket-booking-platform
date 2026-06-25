"use client";

import React, { useState, useEffect } from 'react';
import { card, text, title, muted } from "@/styles/ui";
import { authClient } from '@/lib/auth-client';
import { loadStripe } from '@stripe/stripe-js';

// 💳 স্ট্রাইপ ইনিশিয়েলাইজেশন (আপনার .env.local ফাইলে NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY যুক্ত করুন)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_mock_key");

// 🕒 লাইভ কাউন্টডাউন কম্পোনেন্ট
const BookingCountdown = ({ departureDate, departureTime, status, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (status?.toLowerCase() === 'rejected') {
      setTimeLeft("");
      return;
    }

    const interval = setInterval(() => {
      const departureDateTimeStr = `${departureDate}T${departureTime || "00:00"}`;
      const difference = new Date(departureDateTimeStr).getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft("🚨 Departure time passed!");
        setIsExpired(true);
        if (onExpire) onExpire();
        clearInterval(interval);
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(`⏳ ${d}d : ${h}h : ${m}m : ${s}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [departureDate, departureTime, status, onExpire]);

  if (status?.toLowerCase() === 'rejected') return null;

  return (
    <p className={`text-xs font-bold m-0 mt-1 ${isExpired ? 'text-red-500' : 'text-orange-600 dark:text-orange-400'}`}>
      {timeLeft}
    </p>
  );
};

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoadingId, setPaymentLoadingId] = useState(null);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const { data: session } = authClient.useSession();
  const userEmail = session?.user?.email;

  // ১. ইউজারের ইমেইল অনুযায়ী বুকিং ডেটা ফেচ করা
  useEffect(() => {
    if (!userEmail) return;

    const fetchMyBookings = async () => {
      try {
        const res = await fetch(`${serverUrl}/bookings/${userEmail}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        }
      } catch (error) {
        console.error("Error fetching user bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [userEmail, serverUrl]);

  // ২. ফর্ম সাবমিট হ্যান্ডেলার (Stripe Checkout Integration)
  const handleFormPayment = async (e, booking) => {
    e.preventDefault(); // ফর্মের ডিফল্ট সাবমিট পেজ লোড ব্লক করা

    // সেফটি চেক: ডিপার্চার টাইম পার হয়ে গেলে পেমেন্ট ব্লক করা হবে
    const departureDateTimeStr = `${booking.departureDate}T${booking.departureTime || "00:00"}`;
    if (new Date().getTime() > new Date(departureDateTimeStr).getTime()) {
      alert("You cannot make payment because the departure date and time have already passed!");
      return;
    }

    setPaymentLoadingId(booking._id);

    try {
      // 💡 সমাধান: রিলেটিভ পাথ ব্যবহার করে Next.js API রুটকে কল করা হয়েছে
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking._id,
          ticketId: booking.ticketId,
          amount: booking.totalPrice,
          ticketTitle: booking.ticketTitle,
          bookingQuantity: booking.bookingQuantity
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        // ব্যাকএন্ড যদি সরাসরি রিডাইরেক্ট ইউআরএল পাঠায় তবে সেখানে পাঠানো হবে
        if (data.url) {
          window.location.href = data.url;
        } else if (data.sessionId) {
          const stripe = await stripePromise;
          const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
          if (error) console.error("Stripe redirect error:", error);
        }
      } else {
        alert("Failed to initiate Stripe payment session.");
      }
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setPaymentLoadingId(null);
    }
  };

 // 🎨 সম্পূর্ণ হাই-কন্ট্রাস্ট কালার জেনারেটর ব্যাজ (সবগুলো স্ট্যাটাস একদম ক্লিয়ার বোঝার জন্য)
const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'accepted': 
      // 💜 কালার: গাঢ় পার্পল টেক্সট এবং স্ট্রং বর্ডার
      return 'bg-purple-100 text-purple-950 border-purple-400 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-700 font-extrabold';
    
    case 'paid': 
      // 💚 কালার: গাঢ় গ্রিন টেক্সট এবং স্ট্রং বর্ডার
      return 'bg-green-100 text-green-950 border-green-400 dark:bg-green-950 dark:text-green-200 dark:border-green-700 font-extrabold';
    
    case 'rejected': 
      // ❤️ কালার: গাঢ় রেড টেক্সট এবং স্ট্রং বর্ডার
      return 'bg-red-100 text-red-950 border-red-400 dark:bg-red-950 dark:text-red-200 dark:border-red-700 font-extrabold';
    
    default: 
      // 💙 Pending এর জন্য: গাঢ় ব্লু টেক্সট এবং স্ট্রং বর্ডার
      return 'bg-blue-100 text-blue-950 border-blue-400 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-700 font-extrabold';
  }
};

  if (loading) return <div className="text-center py-12 text-sm text-gray-500">Loading your bookings...</div>;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6" style={{ fontFamily: 'sans-serif' }}>
      
      {/* হেডার */}
      <div className="border-b border-gray-100 dark:border-neutral-800 pb-2">
        <h1 className={`${title} text-2xl font-bold m-0`}>My Booked Tickets</h1>
        <p className={`${muted} text-sm m-0 mt-1`}>Track your booking requests, approval status, and complete purchase securely</p>
      </div>

      {/* ৩ কলামের গ্রিড লেআউট */}
      {bookings.length === 0 ? (
        <div className={`${muted} text-center py-12 text-sm`}>
          You haven't booked any tickets yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => {
            const departureDateTimeStr = `${booking.departureDate}T${booking.departureTime || "00:00"}`;
            const isExpired = new Date().getTime() > new Date(departureDateTimeStr).getTime();
            const showPayButton = booking.status?.toLowerCase() === 'accepted' && !isExpired;

            return (
              <div 
                key={booking._id} 
                className={`${card} flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md transition-all rounded-xl border border-gray-100 dark:border-neutral-800/60 bg-white dark:bg-neutral-900`}
              >
                
                {/* ইমেজ এবং স্ট্যাটাস ব্যাজ */}
                <div className="relative h-44 w-full bg-gray-100 dark:bg-neutral-800">
                  {booking.image ? (
                    <img src={booking.image} alt={booking.ticketTitle} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image Available</div>
                  )}
                  
                  {/* ডাইনামিক স্ট্যাটাস ব্যাজ */}
                  <span className={`absolute top-3 right-3 px-2.5 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${getStatusBadgeClass(booking.status)}`}>
                    {booking.status || 'pending'}
                  </span>
                </div>

                {/* কার্ড কন্টেন্ট */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className={`${title} text-base font-bold line-clamp-1 m-0`}>
                      {booking.ticketTitle}
                    </h3>
                    
                    <p className={`${text} text-xs font-medium text-gray-600 dark:text-neutral-300 m-0`}>
                      📍 Route: <span className="font-semibold">{booking.fromLocation || 'N/A'}</span> ➔ <span className="font-semibold">{booking.toLocation || 'N/A'}</span>
                    </p>

                    <p className="text-xs text-gray-500 m-0">
                      📅 Departure: <b>{booking.departureDate || 'N/A'}</b> at {booking.departureTime || 'Not Specified'}
                    </p>

                    {/* টাইমার সেকশন (রিজেক্টেড না হলে কাউন্টডাউন দেখাবে) */}
                    <div className="pt-1 border-t border-gray-50 dark:border-neutral-800/20">
                      <BookingCountdown 
                        departureDate={booking.departureDate} 
                        departureTime={booking.departureTime}
                        status={booking.status}
                      />
                    </div>
                  </div>

                  {/* কোয়ান্টিটি ও টোটাল প্রাইস সেকশন */}
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-neutral-950 p-3 rounded-lg text-xs">
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase m-0">Qty Booked</p>
                      <p className="font-bold text-gray-800 dark:text-neutral-200 m-0">{booking.bookingQuantity} Pcs</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-[10px] uppercase m-0">Total Amount</p>
                      <p className={`${title} text-base font-black text-blue-600 dark:text-blue-400 m-0`}>৳{booking.totalPrice}</p>
                    </div>
                  </div>

                  {/* 📝 এখানে শর্তসাপেক্ষে HTML ফর্ম অ্যাকশন সেটআপ করা হয়েছে */}
                  {showPayButton && (
                    <form onSubmit={(e) => handleFormPayment(e, booking)} method="POST">
                      {/* ডেটা ট্র্যাকিং এর জন্য হিডেন ইনপুট */}
                      <input type="hidden" name="bookingId" value={booking._id} />
                      
                      <button
                        type="submit"
                        role="link"
                        disabled={paymentLoadingId === booking._id}
                        className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-xs transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
                        style={{ border: 'none', cursor: 'pointer' }}
                      >
                        {paymentLoadingId === booking._id ? "Processing..." : "💳 Pay Now"}
                      </button>
                    </form>
                  )}

                  {/* টাইম পার হয়ে গেলে ওয়ার্নিং টেক্সট */}
                  {booking.status?.toLowerCase() === 'accepted' && isExpired && (
                    <p className="text-center text-[11px] text-red-500 font-semibold m-0 bg-red-50 dark:bg-red-950/20 py-1.5 rounded">
                      ❌ Payment locked: Departure time has passed.
                    </p>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;