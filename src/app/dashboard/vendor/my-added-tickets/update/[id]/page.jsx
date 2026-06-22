

import UpdateTicket from '@/components/dashboard/vendor/UpdateTicket';
import React from 'react';
const UpdateTicketPage = async ({ params }) => {
  const { id } = await params; 

  let ticketData = null;


  
  try {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ;
    const res = await fetch(`${serverUrl}/vendor/my-added-tickets/${id}`, { cache: 'no-store' });
    if (res.ok) {
      ticketData = await res.json();
    }
  } catch (error) {
    console.error("Error fetching ticket single data:", error);
  }

  console.log("ticketData",ticketData);

  return (
    <div className="p-6">
      <h2>Update Ticket: {ticketData?.title}</h2>

   <UpdateTicket ticketData={ticketData} />

    </div>
  );
};

export default UpdateTicketPage;