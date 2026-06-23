"use client";

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { card, text, title, muted } from "@/styles/ui";

const RevenueOverviewPage = () => {
  const [stats, setStats] = useState({
    totalAdded: 0,
    totalSold: 0,
    totalRevenue: 0,
    chartData: []
  });
  const [loading, setLoading] = useState(true);
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        // ব্যাকএন্ড থেকে একবারে সব অ্যানালিটিক্স ডেটা নিয়ে আসার রিকোয়েস্ট
        const res = await fetch(`${serverUrl}/vendor/revenue-stats`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching revenue stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, [serverUrl]);

  if (loading) {
    return <div className="text-center py-10 text-sm text-gray-500">Loading Revenue Overview...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-8" style={{ fontFamily: 'sans-serif' }}>
      
      {/* হেডার */}
      <div className="border-b border-gray-200 dark:border-neutral-800 pb-4">
        <h1 className={`${title} text-2xl m-0 mb-1`}>Revenue Overview</h1>
        <p className={`${muted} text-sm m-0`}>Track your sales performance, ticket volume, and total earnings.</p>
      </div>

      {/* 📊 ৩টি কাউন্টার কার্ড (Statistics Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* ১. টোটাল টিকিট অ্যাডেড */}
        <div className={`${card} p-6 border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl`}>
          <p className={`${muted} text-xs font-bold uppercase tracking-wider m-0`}>Total Tickets Added</p>
          <p className={`${title} text-3xl font-extrabold m-0 mt-2 text-blue-600 dark:text-blue-400`}>
            {stats.totalAdded} <span className="text-xs font-medium text-gray-400">Pcs</span>
          </p>
        </div>

        {/* ২. টোটাল টিকিট সোল্ড */}
        <div className={`${card} p-6 border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl`}>
          <p className={`${muted} text-xs font-bold uppercase tracking-wider m-0`}>Total Tickets Sold</p>
          <p className={`${title} text-3xl font-extrabold m-0 mt-2 text-green-600 dark:text-green-400`}>
            {stats.totalSold} <span className="text-xs font-medium text-gray-400">Pcs</span>
          </p>
        </div>

        {/* ৩. টোটাল রেভিনিউ */}
        <div className={`${card} p-6 border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl`}>
          <p className={`${muted} text-xs font-bold uppercase tracking-wider m-0`}>Total Revenue</p>
          <p className={`${title} text-3xl font-extrabold m-0 mt-2 text-purple-600 dark:text-purple-400`}>
            ৳{stats.totalRevenue}
          </p>
        </div>

      </div>

      {/* 📈 চার্ট সেকশন */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ক) টিকিট ভলিউম চার্ট (Added vs Sold) */}
        <div className={`${card} p-4 md:p-6 rounded-xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm`}>
          <h3 className={`${title} text-base font-bold mb-4 m-0`}>Ticket Volume (Added vs Sold)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                <YAxis tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                <Tooltip />
                <Bar dataKey="Added" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Sold" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* খ) রেভিনিউ ট্রেন্ড চার্ট */}
        <div className={`${card} p-4 md:p-6 rounded-xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm`}>
          <h3 className={`${title} text-base font-bold mb-4 m-0`}>Revenue Generation Trend</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                <YAxis tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                <Tooltip formatter={(value) => [`৳${value}`, 'Revenue']} />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="Revenue" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default RevenueOverviewPage;