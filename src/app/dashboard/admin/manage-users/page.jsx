"use client";

import React, { useState, useEffect } from 'react';
import { card, text, title, muted } from "@/styles/ui";

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
        alert(data.message);
        fetchUsers(); // টেবিল রিফ্রেশ
      } else {
        alert(data.message || "Failed to update user.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Something went wrong!");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6" style={{ fontFamily: 'sans-serif' }}>
      
      {/* হেডার */}
      <div className="border-b border-gray-200 dark:border-neutral-800 pb-4 mb-6">
        <h1 className={`${title} text-2xl m-0 mb-1`}>Manage Users</h1>
        <p className={`${muted} text-sm m-0`}>Manage roles (Admin/Vendor) and restrict fraud accounts.</p>
      </div>

      {/* ইউজার টেবিল */}
      <div className={`${card} overflow-x-auto shadow-md`}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr className="bg-gray-50/50 dark:bg-neutral-800/30 border-b border-gray-200 dark:border-neutral-800 text-xs uppercase tracking-wider font-semibold text-gray-600 dark:text-neutral-400">
              <th style={{ padding: '12px 16px' }}>Name & Email</th>
              <th style={{ padding: '12px 16px' }}>Current Role</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className={`${muted} text-center py-8 text-sm`}>No users found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className={`border-b border-gray-100 dark:border-neutral-800/60 hover:bg-gray-50/30 text-sm ${text}`}>
                  
                  {/* নাম এবং ইমেইল */}
                  <td style={{ padding: '16px' }}>
                    <p className={`font-semibold ${title}`} style={{ margin: 0 }}>{user.name}</p>
                    <p className={muted} style={{ margin: 0, fontSize: '12px' }}>{user.email}</p>
                  </td>

                  {/* বর্তমান রোল ব্যাজ */}
                  <td style={{ padding: '16px' }}>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase
                      ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400' : 
                        user.role === 'vendor' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400' : 
                        'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'}`}
                    >
                      {user.role || 'User'}
                    </span>
                  </td>

                  {/* ফ্রড স্ট্যাটাস ব্যাज */}
                  <td style={{ padding: '16px' }}>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium
                      ${user.isFraud ? 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400 font-bold' : 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400'}`}
                    >
                      {user.isFraud ? '🚨 FRAUD' : '✅ Active'}
                    </span>
                  </td>

                  {/* অ্যাকশন বাটনসমূহ */}
                  <td style={{ padding: '16px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    
                    {/* Make Admin Button */}
                    <button
                      disabled={loadingId !== null || user.role === 'admin'}
                      onClick={() => handleUpdateUser(user._id, { role: 'admin' })}
                      className="bg-purple-600 hover:bg-purple-700 text-white rounded px-3 py-1 text-xs font-medium transition-all disabled:opacity-40"
                      style={{ border: 'none', cursor: 'pointer' }}
                    >
                      Make Admin
                    </button>

                    {/* Make Vendor Button */}
                    <button
                      disabled={loadingId !== null || user.role === 'vendor'}
                      onClick={() => handleUpdateUser(user._id, { role: 'vendor' })}
                      className="bg-orange-500 hover:bg-orange-600 text-white rounded px-3 py-1 text-xs font-medium transition-all disabled:opacity-40"
                      style={{ border: 'none', cursor: 'pointer' }}
                    >
                      Make Vendor
                    </button>

                    {/* Mark as Fraud / Safe Button */}
                    <button
                      disabled={loadingId !== null}
                      onClick={() => handleUpdateUser(user._id, { isFraud: !user.isFraud })}
                      className={`rounded px-3 py-1 text-xs font-medium text-white transition-all
                        ${user.isFraud ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                    >
                      {user.isFraud ? 'Mark Safe' : 'Mark Fraud'}
                    </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsersPage;