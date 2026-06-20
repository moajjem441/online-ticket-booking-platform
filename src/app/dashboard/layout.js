"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Avatar } from "@heroui/react";
import { FaBus, FaChartPie, FaTicketAlt, FaUserCog, FaSignOutAlt } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
// আপনার ডিজাইন টোকেনসমূহ ইমপোর্ট করুন
import { card, title, text, muted, navbar } from "@/styles/ui";

export default function DashBoardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // ড্যাশবোর্ডের মেনু আইটেমসমূহ
  const menuItems = [
    { name: "Overview", href: "/dashboard", icon: <FaChartPie /> },
    { name: "My Tickets", href: "/dashboard/tickets", icon: <FaTicketAlt /> },
    { name: "Profile Settings", href: "/dashboard/profile", icon: <FaUserCog /> },
  ];

  return (
    <div className="flex min-h-screen relative w-full bg-neutral-50 dark:bg-neutral-950 transition-colors">
      
      {/* ১. সাইডবার (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 p-6 flex flex-col justify-between border-r 
        transition-transform duration-300 transform lg:translate-x-0 lg:static lg:h-screen
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        ${card}`} // আপনার card টোকেন দিয়ে বডি ও বর্ডার হ্যান্ডেল করা হয়েছে
      >
        <div className="flex flex-col gap-8">
          {/* সাইডবার হেডার / লোগো */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <FaBus className="text-blue-500 text-2xl" />
              <span className="bg-gradient-to-r from-violet-600 via-indigo-400 to-black dark:to-white bg-clip-text text-transparent font-extrabold">Ticket</span>
              <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-orange-400 bg-clip-text text-transparent font-black">Bari</span>
            </Link>
            {/* মোবাইল ক্লোজ বাটন */}
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-2xl p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <HiX className={title} />
            </button>
          </div>

          {/* নেভিগেশন লিংকসমূহ */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                      : `hover:bg-neutral-100 dark:hover:bg-neutral-800/60 ${text}`
                  }`}
                >
                  <span className={isActive ? "text-white" : "text-neutral-400 group-hover:text-blue-500 transition-colors"}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* বটম সেকশন: লগআউট বাটন */}
        <button className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/5 transition-all text-left w-full mt-auto`}>
          <FaSignOutAlt />
          Logout
        </button>
      </aside>

      {/* মোবাইল ড্রয়ার ওপেন থাকা অবস্থায় ব্যাকড্রপ ব্লার */}
      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 lg:hidden" />
      )}

      {/* ২. মেইন কন্টেন্ট এরিয়া */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* ড্যাশবোর্ড টপ বার / হেডার */}
        <header className={`h-20 px-6 flex items-center justify-between sticky top-0 z-30 ${navbar}`}>
          <div className="flex items-center gap-3">
            {/* হ্যামবার্গার মেনু বাটন (শুধুমাত্র মোবাইলে ভিজিবল) */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-gray-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <HiMenu className={`text-xl ${title}`} />
            </button>
            <div>
              <h2 className={`text-base md:text-lg font-bold tracking-tight leading-none ${title}`}>Dashboard</h2>
              <p className={`text-xs mt-1 hidden md:block ${muted}`}>Manage your tickets and account status</p>
            </div>
          </div>

          {/* রাইট সাইড: ইউজার অ্যাভাটার */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className={`text-sm font-semibold leading-none ${title}`}>Muazzam Hossain</p>
              <p className={`text-xs mt-0.5 ${muted}`}>Customer</p>
            </div>
            <Avatar isBordered color="primary" radius="md" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" className="w-9 h-9" />
          </div>
        </header>

        {/* ড্যাশবোর্ড এর চাইল্ড কন্টেন্ট পেজসমূহ */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}