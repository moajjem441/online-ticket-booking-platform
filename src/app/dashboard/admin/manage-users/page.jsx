"use client";

import React, { useState, useEffect } from 'react';
import { card, text, title, muted } from "@/styles/ui";
import toast from 'react-hot-toast';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  // ১. সব ইউজার লোড করার ফাংশন
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${serverUrl}/admin/all-users`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ২. ইউজার স্ট্যাটাস ও রোল আপডেট হ্যান্ডেলার
  const handleUpdateUser = async (id, updateData) => {
    setLoadingId(id);
    try {
      const res = await fetch(`${serverUrl}/admin/users/role/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "User updated successfully!");
        fetchUsers(); // টেবিল বা কার্ড রিফ্রেশ
      } else {
        toast.error(data.message || "Failed to update user.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6" style={{ fontFamily: 'sans-serif' }}>
      
      {/* হেডার */}
      <div className="border-b border-gray-200 dark:border-neutral-800 pb-4 mb-6">
        <h1 className={`${title} text-2xl font-black m-0 mb-1`}>Manage Users</h1>
        <p className={`${muted} text-sm m-0 font-light`}>Manage roles (Admin/Vendor) and restrict fraud accounts.</p>
      </div>

      {users.length === 0 ? (
        <div className={`${card} text-center py-12 text-sm bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-xl`}>
          No users found.
        </div>
      ) : (
        <>
          {/* 📱 📑 মোবাইল এবং ট্যাবলেট ভিউ (Responsive Card Layout) */}
          {/* মোবাইলে ১টি এবং ট্যাবলেটে (md) ২টি করে কার্ড পাশাপাশি বসবে। ডেস্কটপে (lg) হাইড থাকবে */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {users.map((user) => (
              <div 
                key={user._id}
                className="p-5 border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm flex flex-col justify-between space-y-4"
              >
                {/* নাম, ইমেইল এবং ব্যাজ সেকশন */}
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <h4 className={`font-bold text-base truncate ${title}`}>{user.name}</h4>
                      <p className={`${muted} text-xs truncate mt-0.5`}>{user.email}</p>
                    </div>
                  </div>

                  {/* রোল এবং ফ্রড স্ট্যাটাস গ্রিড */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-50 dark:border-neutral-800/40 text-xs">
                    <div>
                      <p className="text-gray-400 font-medium mb-1">Role</p>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide inline-block
                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400' : 
                          user.role === 'vendor' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400' : 
                          'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'}`}
                      >
                        {user.role || 'User'}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 font-medium mb-1">Status</p>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide inline-block
                        ${user.isFraud ? 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400'}`}
                      >
                        {user.isFraud ? '🚨 FRAUD' : '✅ Active'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* অ্যাকশন বাটনসমূহ (মোবাইল ও ট্যাব রেসপনসিভ) */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-50 dark:border-neutral-800/40 justify-end">
                  <button
                    disabled={loadingId !== null || user.role === 'admin'}
                    onClick={() => handleUpdateUser(user._id, { role: 'admin' })}
                    className="flex-1 sm:flex-none bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-semibold text-xs px-3 py-2 rounded-xl transition-all active:scale-95 shadow-sm"
                  >
                    Admin
                  </button>

                  <button
                    disabled={loadingId !== null || user.role === 'vendor'}
                    onClick={() => handleUpdateUser(user._id, { role: 'vendor' })}
                    className="flex-1 sm:flex-none bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-semibold text-xs px-3 py-2 rounded-xl transition-all active:scale-95 shadow-sm"
                  >
                    Vendor
                  </button>

                  <button
                    disabled={loadingId !== null}
                    onClick={() => handleUpdateUser(user._id, { isFraud: !user.isFraud })}
                    className={`flex-1 sm:flex-none font-semibold text-xs px-3 py-2 rounded-xl transition-all active:scale-95 shadow-sm text-white
                      ${user.isFraud ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
                  >
                    {user.isFraud ? 'Unmark Fraud' : 'Mark Fraud'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 💻 ডেস্কটপ ভিউ (Premium Table Layout) - শুধুমাত্র 'lg' এবং তার বড় স্ক্রিনের জন্য */}
          <div className={`${card} hidden lg:block overflow-x-auto shadow-md rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900`}>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-50/70 dark:bg-neutral-950 border-b border-gray-100 dark:border-neutral-800 text-xs uppercase tracking-wider font-bold text-gray-600 dark:text-neutral-400">
                  <th className="p-4">Name & Email</th>
                  <th className="p-4">Current Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-neutral-800/60">
                {users.map((user) => (
                  <tr 
                    key={user._id} 
                    className="hover:bg-gray-50/30 dark:hover:bg-neutral-800/10 text-sm transition-colors duration-200"
                  >
                    {/* নাম এবং ইমেইল */}
                    <td className="p-4">
                      <div className="min-w-0">
                        <p className={`font-bold ${title} m-0`}>{user.name}</p>
                        <p className={`${muted} m-0 mt-0.5 text-xs font-light`}>{user.email}</p>
                      </div>
                    </td>

                    {/* বর্তমান রোল ব্যাজ */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wide inline-block
                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400' : 
                          user.role === 'vendor' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400' : 
                          'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'}`}
                      >
                        {user.role || 'User'}
                      </span>
                    </td>

                    {/* ফ্রড স্ট্যাটাস ব্যাজ */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded text-xs font-bold tracking-wide inline-block
                        ${user.isFraud ? 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400'}`}
                      >
                        {user.isFraud ? '🚨 FRAUD' : '✅ Active'}
                      </span>
                    </td>

                    {/* অ্যাকশন বাটনসমূহ */}
                    <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center items-center">
                        <button
                          disabled={loadingId !== null || user.role === 'admin'}
                          onClick={() => handleUpdateUser(user._id, { role: 'admin' })}
                          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors active:scale-95"
                        >
                          Make Admin
                        </button>

                        <button
                          disabled={loadingId !== null || user.role === 'vendor'}
                          onClick={() => handleUpdateUser(user._id, { role: 'vendor' })}
                          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors active:scale-95"
                        >
                          Make Vendor
                        </button>

                        <button
                          disabled={loadingId !== null}
                          onClick={() => handleUpdateUser(user._id, { isFraud: !user.isFraud })}
                          className={`font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors active:scale-95 text-white
                            ${user.isFraud ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
                        >
                          {user.isFraud ? 'Mark Safe' : 'Mark Fraud'}
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

export default ManageUsersPage;