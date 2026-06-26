import React from 'react';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Avatar, Chip } from "@heroui/react";
import { Person, Envelope, ShieldCheck, Calendar } from "@gravity-ui/icons";
// আপনার ডিজাইন টোকেনসমূহ ইমপোর্ট করুন
import { card, title, text, muted } from "@/styles/ui";

const AdminProfilePage = async () => {
  // সার্ভার সাইডে সেশন পাওয়া
  const session = await auth.api.getSession({
    headers: await headers(), // headers() একটি প্রমিজ রিটার্ন করে (Next.js 15+)
  });

  // যদি সেশন না থাকে (লগইন করা নাই)
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className={`w-full max-w-md p-6 text-center border ${card}`}>
          <p className={`text-base font-medium ${text}`}>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const user = session.user;

  // ইউজারের রোলের উপর ভিত্তি করে চিপ (Badge) এর কালার সেট করা
  const roleColor = 
    user.role === "admin" ? "danger" : 
    user.role === "vendor" ? "warning" : "primary";

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6 transition-colors relative">
      
      {/* Background Decorative Glow (ডার্ক মোডে লাক্সারি ভাইব দেওয়ার জন্য) */}
      <div className="absolute w-[300px] h-[300px] bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-[80px] top-0 right-1/4 pointer-events-none" />

      {/* প্রোফাইল হেডার কার্ড */}
      <div className={`p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xl relative z-10 ${card}`}>
        <Avatar
          src={user.image || "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
          className="w-24 h-24 text-large border-10 border-blue-500/30 shadow-md"
          
          radius="xl"
          color={roleColor}
        />
        
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${title}`}>
              {user.name}
            </h1>
            <div className="mx-auto sm:mx-0">
              <Chip 
                color={roleColor} 
                variant="flat" 
                size="sm" 
                className="capitalize font-semibold rounded-lg"
              >
                {user.role || "User"}
              </Chip>
            </div>
          </div>
          <p className={`text-sm md:text-base flex items-center justify-center sm:justify-start gap-2 ${muted}`}>
            <Envelope className="size-4 opacity-80" />
            {user.email}
          </p>
        </div>
      </div>

      {/* বিস্তারিত তথ্য গ্রিড সেকশন */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        
        {/* ১. পার্সোনাল ইনফরমেশন কার্ড */}
        <div className={`p-6 shadow-md ${card}`}>
          <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-neutral-800 pb-3 ${title}`}>
            <Person className="text-blue-500 size-5" /> Account Details
          </h3>
          <div className="space-y-4">
            <div>
              <p className={`text-xs uppercase tracking-wider font-semibold ${muted}`}>Full Name</p>
              <p className={`text-base font-medium mt-0.5 ${text}`}>{user.name}</p>
            </div>
            <div>
              <p className={`text-xs uppercase tracking-wider font-semibold ${muted}`}>Email Address</p>
              <p className={`text-base font-medium mt-0.5 ${text}`}>{user.email}</p>
            </div>
          </div>
        </div>

        {/* ২. সিকিউরিটি ও স্ট্যাটাস কার্ড */}
        <div className={`p-6 shadow-md ${card}`}>
          <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-neutral-800 pb-3 ${title}`}>
            <ShieldCheck className="text-green-500 size-5" /> Security & Status
          </h3>
          <div className="space-y-4">
            <div>
              <p className={`text-xs uppercase tracking-wider font-semibold ${muted}`}>Account Role</p>
              <p className={`text-base font-semibold mt-1 capitalize text-${roleColor === 'danger' ? 'red' : roleColor === 'warning' ? 'amber' : 'blue'}-500`}>
                {user.role || "Standard Customer"}
              </p>
            </div>
            <div>
              <p className={`text-xs uppercase tracking-wider font-semibold ${muted}`}>Status</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className={`text-base font-medium ${text}`}>Active Session</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminProfilePage;