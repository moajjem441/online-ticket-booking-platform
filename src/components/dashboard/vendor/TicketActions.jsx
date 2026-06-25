"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';

export const TicketActions = ({ ticketId, isRejected }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    
    setIsDeleting(true);
    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ;
      const res = await fetch(`${serverUrl}/vendor/my-added-tickets/${ticketId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {
        // পেজটি রিফ্রেশ করে ইনস্ট্যান্ট ডেটা আপডেট করবে
        toast.success("Ticket deleted successfully!");
        router.refresh();
      } else {
        toast.error("Failed to delete the ticket.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50/50 dark:bg-neutral-900/30 border-t border-gray-100 dark:border-neutral-800 grid grid-cols-2 gap-3">
      {/* Update Button */}
      <Link 
        href={isRejected ? "#" : `/dashboard/vendor/my-added-tickets/update/${ticketId}`}
        className="w-full"
        onClick={(e) => isRejected && e.preventDefault()}
      >
        <Button 
          className="w-full font-semibold" 
          variant="bordered"
          size="sm"
          isDisabled={isRejected}
        >
          Update
        </Button>
      </Link>

      {/* Delete Button */}
      <Button 
        className="w-full font-semibold" 
        color="danger" 
        variant="flat"
        size="sm"
        isDisabled={isRejected || isDeleting}
        isLoading={isDeleting}
        onClick={handleDelete}
      >
        Delete
      </Button>
    </div>
  );
};