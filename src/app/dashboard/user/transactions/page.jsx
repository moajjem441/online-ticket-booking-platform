"use client";

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { title, muted } from "@/styles/ui";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const { data: session } = authClient.useSession();
  const userEmail = session?.user?.email;

  useEffect(() => {
    if (!userEmail) return;

    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${serverUrl}/transactions/${userEmail}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setTransactions(data);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userEmail, serverUrl]);

  if (loading) return <div className="text-center py-12 text-sm text-gray-500">Loading payment history...</div>;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6" style={{ fontFamily: 'sans-serif' }}>
      
      {/* হেডার সেকশন */}
      <div className="border-b border-gray-100 dark:border-neutral-800 pb-3">
        <h1 className={`${title} text-2xl font-bold m-0`}>Transaction History</h1>
        <p className={`${muted} text-sm m-0 mt-1`}>View all your completed Stripe payments and ticket purchases</p>
      </div>

      {transactions.length === 0 ? (
        <div className={`${muted} text-center py-12 text-sm`}>
          No transaction records found.
        </div>
      ) : (
        <>
          {/* 📱 📑 মোবাইল এবং ট্যাবলেট ভিউ (Responsive Card Layout) */}
          {/* মোবাইলে ১টি করে এবং ট্যাবলেটে (md) ২টি করে কার্ড পাশাপাশি বসবে। ডেস্কটপে (lg) হাইড থাকবে */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {transactions.map((tx, index) => (
              <div 
                key={tx._id} 
                className="p-5 border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-3">
                  {/* কার্ডের উপরের ইনফো */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-green-100 text-green-950 border border-green-400 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800 rounded-full shadow-sm">
                      SUCCESS
                    </span>
                  </div>

                  {/* টিকিট টাইটেল ও অ্যামাউন্ট */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 font-medium">Ticket Title</p>
                      <h4 className="font-bold text-gray-800 dark:text-neutral-100 text-base mt-0.5 truncate" title={tx.ticketTitle}>
                        {tx.ticketTitle}
                      </h4>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-400 font-medium">Amount</p>
                      <p className="font-black text-green-600 dark:text-green-400 text-base mt-0.5">৳{tx.totalPrice}</p>
                    </div>
                  </div>
                </div>

                {/* ট্রানজেকশন আইডি এবং ডেট */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-50 dark:border-neutral-800/50 text-xs">
                  <div className="min-w-0">
                    <p className="text-gray-400 font-medium">Transaction ID</p>
                    <p className="font-mono text-blue-600 dark:text-blue-400 font-semibold mt-0.5 truncate" title={tx._id}>
                      {tx._id}
                    </p>
                  </div>
                  <div className="text-right min-w-0">
                    <p className="text-gray-400 font-medium">Payment Date</p>
                    <p className="text-gray-500 dark:text-neutral-400 font-medium mt-0.5 truncate">
                      {tx.departureDate || new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 💻 ডেস্কটপ ভিউ (প্রফেশনাল টেবিল) - শুধুমাত্র 'lg' এবং তার বড় স্ক্রিনের জন্য */}
          <div className="hidden lg:block overflow-x-auto rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
            <table className="table w-full text-left border-collapse">
              <thead className="bg-gray-50/70 dark:bg-neutral-950 text-gray-600 dark:text-neutral-400 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4 w-12">#</th>
                  <th className="p-4">Transaction ID (Booking)</th>
                  <th className="p-4">Ticket Title</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment Date</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-neutral-800 text-sm">
                {transactions.map((tx, index) => (
                  <tr key={tx._id} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/20 transition-colors">
                    <td className="p-4 font-medium text-gray-400">{index + 1}</td>
                    <td className="p-4 font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold tracking-tight">
                      {tx._id}
                    </td>
                    <td className="p-4 font-bold text-gray-800 dark:text-neutral-200">
                      {tx.ticketTitle}
                    </td>
                    <td className="p-4 font-black text-green-600 dark:text-green-400 text-base">
                      ৳{tx.totalPrice}
                    </td>
                    <td className="p-4 text-gray-500 dark:text-neutral-400 text-xs font-medium">
                      {tx.departureDate || new Date().toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-2.5 py-1 text-[10px] font-extrabold uppercase bg-green-100 text-green-950 border border-green-400 dark:bg-green-950 dark:text-green-200 dark:border-green-700 rounded-full shadow-sm">
                        SUCCESS
                      </span>
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

export default TransactionHistory;