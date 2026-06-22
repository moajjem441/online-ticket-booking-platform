import React from 'react';
import Link from 'next/link';
import { Button, Card, Chip } from '@heroui/react';
import { HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi';
import { card, title, text, muted, buttonPrimary } from "@/styles/ui";
import { TicketActions } from '@/components/dashboard/vendor/TicketActions';



const getStatusChip = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return <Chip color="success" variant="flat" size="sm" className="font-semibold">Approved</Chip>;
    case 'rejected':
      return <Chip color="danger" variant="flat" size="sm" className="font-semibold">Rejected</Chip>;
    case 'pending':
    default:
      return <Chip color="warning" variant="flat" size="sm" className="font-semibold">Pending</Chip>;
  }
};

const MyAddedTicketsPage = async () => {
  let tickets = [];
  let errorMessage = "";

  try {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ;
    const res = await fetch(`${serverUrl}/vendor/my-added-tickets`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      
      if (Array.isArray(data)) {
        tickets = data;
      } else if (data && Array.isArray(data.tickets)) {
        tickets = data.tickets;
      } else {
        tickets = [];
      }
    } else {
      errorMessage = "Failed to load tickets from server.";
    }
  } catch (error) {
    console.error("Error fetching vendor tickets:", error);
    errorMessage = "Something went wrong while fetching data.";
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Page Header */}
      <div className="mb-6 border-b border-gray-100 dark:border-neutral-800 pb-4">
        <h1 className={`text-2xl font-bold tracking-tight text-neutral-900 dark:text-white ${title}`}>
          My Added Tickets
        </h1>
        <p className={`text-xs mt-1 text-neutral-500 dark:text-neutral-400 ${muted}`}>
          Manage and monitor all the tickets you have listed
        </p>
      </div>

      {/* Error View */}
      {errorMessage && (
        <div className="p-4 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-xl text-center font-medium border border-red-100 dark:border-red-900/40">
          {errorMessage}
        </div>
      )}

      {/* Empty State View */}
      {tickets.length === 0 && !errorMessage && (
        <div className="text-center py-12 border border-dashed border-gray-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900">
          <p className={`text-neutral-500 dark:text-neutral-400 ${text}`}>No tickets added yet.</p>
          <Link href="/dashboard/vendor/add-ticket" className="mt-4 inline-block">
            <Button className={buttonPrimary} size="sm">Add Your First Ticket</Button>
          </Link>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => {
          const isRejected = ticket.verificationStatus?.toLowerCase() === 'rejected';

          return (
            <Card 
              key={ticket._id || ticket.id} 
              className={`border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-md rounded-2xl flex flex-col justify-between overflow-hidden ${card}`}
            >
              {/* Image & Status Overlay */}
              <div className="h-44 w-full bg-gray-100 dark:bg-neutral-800 relative overflow-hidden">
                {ticket.image ? (
                  <img 
                    src={ticket.image} 
                    alt={ticket.title} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400 dark:text-neutral-500">
                    No Image Available
                  </div>
                )}
                <div className="absolute top-3 right-3 z-10">
                  {getStatusChip(ticket.verificationStatus)}
                </div>
              </div>

              {/* Ticket Details Body */}
              <div className="p-5 flex-1 flex flex-col gap-3">
                <div>
                  <h3 className={`text-lg font-bold text-neutral-900 dark:text-white line-clamp-1 ${title}`}>
                    {ticket.title}
                  </h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase mt-0.5 tracking-wider">
                    {ticket.transportType === 't' ? 'Train' : ticket.transportType || 'Others'}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                  <HiOutlineLocationMarker className="text-blue-500 shrink-0 size-4" />
                  <span className={`truncate ${text}`}>
                    {ticket.fromLocation} ➔ {ticket.toLocation}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-neutral-500 dark:text-neutral-400 bg-gray-50 dark:bg-neutral-900/50 p-2.5 rounded-xl border border-gray-100 dark:border-neutral-800/60">
                  <div className="flex items-center gap-1.5">
                    <HiOutlineCalendar className="shrink-0 text-neutral-400" />
                    <span className="truncate">{ticket.departureDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HiOutlineClock className="shrink-0 text-neutral-400" />
                    <span className="truncate">{ticket.departureTime}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 mt-auto border-t border-gray-50 dark:border-neutral-800/40">
                  <div>
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-medium">Price</p>
                    <p className="text-base font-bold text-neutral-900 dark:text-white">৳ {ticket.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-medium">Available</p>
                    <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{ticket.quantity} Pcs</p>
                  </div>
                </div>
              </div>

              {/* 👈 নতুন ইন্টারঅ্যাক্টিভ ক্লায়েন্ট বাটন অ্যাকশন কম্পোনেন্ট */}
              <TicketActions 
                ticketId={ticket._id || ticket.id} 
                isRejected={isRejected} 
              />
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MyAddedTicketsPage;