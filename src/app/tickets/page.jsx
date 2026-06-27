"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { card, text, title, muted } from "@/styles/ui";



const AllTicketsPage =  () => {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // ফিল্টার এবং সর্ট স্টেটসমূহ
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [transportFilter, setTransportFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  // 📄 প্যাগিনেশন স্টেটসমূহ
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // প্রতি পেজে কয়টি করে টিকিট কার্ড দেখাতে চান (যেমন: ৬টি)

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  



  // ১. শুধুমাত্র Admin Approved টিকিটগুলো লোড করা
  useEffect(() => {
    const fetchApprovedTickets = async () => {
      try {
       
        
                const res = await fetch(`${serverUrl}/all-tickets`, {
                  cache: 'no-store'
                });
        if (res.ok) {
          const data = await res.json();
          const approvedOnly = data.filter(
            ticket => ticket.verificationStatus?.toLowerCase() === 'approved'
          );
          setTickets(approvedOnly);
          setFilteredTickets(approvedOnly);
        }
      } catch (error) {
        console.error("Error fetching approved tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedTickets();
  }, [serverUrl]);

  // ২. সার্চ, ফিল্টার এবং সর্টিং হ্যান্ডেল করার জন্য কম্বাইন্ড  ইফেক্ট
  useEffect(() => {
    let result = tickets.filter(ticket => {
      const matchFrom = ticket.fromLocation?.toLowerCase().includes(searchFrom.toLowerCase());
      const matchTo = ticket.toLocation?.toLowerCase().includes(searchTo.toLowerCase());
      const matchTransport = transportFilter === "" || 
        ticket.transportType?.toLowerCase().trim() === transportFilter.toLowerCase().trim();
      
      return matchFrom && matchTo && matchTransport;
    });

    if (sortBy === "lowToHigh") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "highToLow") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    setFilteredTickets(result);
    setCurrentPage(1); // সার্চ বা ফিল্টার চেঞ্জ হলে ইউজারকে অটোমেটিক ১ম পেজে ফেরত নিয়ে যাবে
  }, [searchFrom, searchTo, transportFilter, sortBy, tickets]);

  // 🧮 প্যাগিনেশন ক্যালকুলেশন লজিক
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // বর্তমান পেজের জন্য ফিল্টার করা লিস্ট থেকে নির্দিষ্ট অংশ কেটে নেওয়া
  const currentItems = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);
  
  // মোট কতগুলো পেজ হবে তা হিসাব করা
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  const handleClearFilters = () => {
    setSearchFrom("");
    setSearchTo("");
    setTransportFilter("");
    setSortBy("");
    setCurrentPage(1);
  };

  if (loading) {
    return <div className="text-center py-12 text-sm text-gray-500">Loading Available Tickets...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6" style={{ fontFamily: 'sans-serif' }}>
      
      {/* হেডার সেকশন */}
      <div className="border-b border-gray-100 dark:border-neutral-800 pb-2">
        <h1 className={`${title} text-2xl font-bold m-0`}>All Available Tickets</h1>
        <p className={`${muted} text-sm m-0 mt-1`}>Find your preferred route, filter by transport type, and sort by price</p>
      </div>

      {/* 🛠️ সার্চ, ফিল্টার এবং সর্ট প্যানেল */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-gray-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-gray-100 dark:border-neutral-800/80">
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">From Location</label>
          <input
            type="text"
            placeholder="e.g. Dhaka"
            value={searchFrom}
            onChange={(e) => setSearchFrom(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 dark:text-neutral-200"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">To Location</label>
          <input
            type="text"
            placeholder="e.g. Cox's Bazar"
            value={searchTo}
            onChange={(e) => setSearchTo(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 dark:text-neutral-200"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Transport Type</label>
          <select
            value={transportFilter}
            onChange={(e) => setTransportFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 dark:text-neutral-200"
          >
            <option value="">All Transports</option>
            <option value="Bus">Bus 🚌</option>
            <option value="Train">Train 🚂</option>
            <option value="Air">Air ✈️</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Sort By Price</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 dark:text-neutral-200"
          >
            <option value="">Default Ordering</option>
            <option value="lowToHigh">Price: Low to High 📈</option>
            <option value="highToLow">Price: High to Low 📉</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleClearFilters}
            className="w-full py-2 bg-gray-200 hover:bg-gray-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-700 dark:text-neutral-200 font-semibold rounded-lg text-xs transition-all"
            style={{ border: 'none', cursor: 'pointer' }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* টিকিট কার্ড গ্রিড (এখানে filteredTickets এর বদলে currentItems ম্যাপ করা হয়েছে) */}
      {currentItems.length === 0 ? (
        <div className={`${muted} text-center py-12 text-sm`}>
          No approved tickets found matching your search criteria.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((ticket) => (
              <div 
                key={ticket._id} 
                className={`${card} flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md transition-all rounded-xl border border-gray-100 dark:border-neutral-800/60 bg-white dark:bg-neutral-900`}
              >
                {/* ইমেজ ও ট্রান্সপোর্ট টাইপ ব্যাজ */}
                <div className="relative h-48 w-full bg-gray-100 dark:bg-neutral-800">
                  {ticket.image ? (
                    <img src={ticket.image} alt={ticket.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image Available</div>
                  )}
                  {ticket.transportType && (
                    <span className="absolute top-3 right-3 bg-blue-600 text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      {ticket.transportType?.toLowerCase() === 'train' ? '🚂' : ticket.transportType?.toLowerCase() === 'air' ? '✈️' : '🚌'} {ticket.transportType}
                    </span>
                  )}
                </div>

                {/* কার্ড বডি কন্টেন্ট */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className={`${title} text-lg font-bold line-clamp-1 m-0`}>
                      {ticket.title}
                    </h3>
                    
                    <p className={`${text} text-sm font-medium text-gray-700 dark:text-neutral-300 m-0`}>
                      📍 <span className="font-semibold">{ticket.fromLocation}</span> ➔ <span className="font-semibold">{ticket.toLocation}</span>
                    </p>

                    {(ticket.departureDate || ticket.departureTime) && (
                      <p className="text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 px-2 py-1 rounded w-fit m-0 font-medium">
                        📅 {ticket.departureDate || 'N/A'} at {ticket.departureTime || 'N/A'}
                      </p>
                    )}

                    {ticket.perks && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {(Array.isArray(ticket.perks) ? ticket.perks : ticket.perks.split(',')).map((perk, index) => (
                          <span key={index} className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-[10px] font-semibold">
                            ✓ {perk.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* প্রাইস এবং কোয়ান্টিটি সেকশন */}
                  <div className="flex items-center justify-between border-t border-gray-50 dark:border-neutral-800/40 pt-3">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase m-0">Price per unit</p>
                      <p className={`${title} text-xl font-extrabold text-blue-600 dark:text-blue-400 m-0`}>৳{ticket.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase m-0">Available Qty</p>
                      <p className={`${text} text-sm font-bold text-gray-800 dark:text-neutral-200 m-0`}>
                        {ticket.quantity || ticket.ticketQuantity || 0} Pcs
                      </p>
                    </div>
                  </div>

                  {/* See Details বাটন */}
                  <button
                    onClick={() => router.push(`/tickets/${ticket._id}`)}
                    className="w-full py-2.5 bg-gray-950 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all shadow-sm active:scale-[0.99]"
                    style={{ border: 'none', cursor: 'pointer' }}
                  >
                    See Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 🔢 প্যাগিনেশন কন্ট্রোল প্যানেল (Pagination UI) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {/* Previous Button */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                Previous
              </button>

              {/* Page Number Buttons */}
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all
                      ${currentPage === pageNumber
                        ? 'bg-blue-600 text-white border border-blue-600'
                        : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-800 hover:bg-gray-50'}`}
                    style={{ cursor: 'pointer' }}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllTicketsPage;