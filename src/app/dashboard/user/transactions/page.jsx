"use client";

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { title, muted } from "@/styles/ui";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ;
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
      <div className="border-b border-gray-100 dark:border-neutral-800 pb-2">
        <h1 className={`${title} text-2xl font-bold m-0`}>Transaction History</h1>
        <p className={`${muted} text-sm m-0 mt-1`}>View all your completed Stripe payments and ticket purchases</p>
      </div>

      {/* ট্রানজেকশন টেবিল */}
      {transactions.length === 0 ? (
        <div className={`${muted} text-center py-12 text-sm`}>
          No transaction records found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
          <table className="table w-full text-left border-collapse">
            
            {/* টেবিল হেডার */}
            <thead className="bg-gray-50 dark:bg-neutral-950 text-gray-700 dark:text-neutral-300 text-xs uppercase font-bold">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Transaction ID (Booking)</th>
                <th className="p-4">Ticket Title</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            {/* টেবিল বডি */}
            <tbody className="divide-y divide-gray-100 dark:divide-neutral-800 text-sm">
              {transactions.map((tx, index) => (
                <tr key={tx._id} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                  <td className="p-4 font-medium text-gray-500">{index + 1}</td>
                  
                  {/* Transaction / Booking ID */}
                  <td className="p-4 font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold">
                    {tx._id}
                  </td>
                  
                  {/* Ticket Title */}
                  <td className="p-4 font-semibold text-gray-800 dark:text-neutral-200">
                    {tx.ticketTitle}
                  </td>
                  
                  {/* Amount */}
                  <td className="p-4 font-bold text-green-600 dark:text-green-400">
                    ৳{tx.totalPrice}
                  </td>
                  
                  {/* Payment Date */}
                  <td className="p-4 text-gray-500 dark:text-neutral-400 text-xs">
                    {/* যদি ডাটাবেজে আলাদা কোনো 'paymentDate' বা 'updatedAt' ফিল্ড না থাকে, 
                        তবে বুকিংয়ের ডিপার্চার ডেট অথবা কারেন্ট লোকাল ফরম্যাট ডেট দেখাতে পারেন */}
                    {tx.departureDate || new Date().toLocaleDateString()}
                  </td>

                  {/* Status Badge */}
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase bg-green-100 text-green-950 border border-green-400 dark:bg-green-950 dark:text-green-200 dark:border-green-700 rounded-full shadow-sm">
                      SUCCESS
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;