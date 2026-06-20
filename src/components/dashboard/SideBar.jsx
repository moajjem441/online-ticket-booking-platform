"use client";

import React, { useState } from "react";
import { Bars, Bell, Envelope, Gear, House, Magnifier, Person, Ticket, Firewall, Archive, CirclePlusFill, PersonFill, Megaphone } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";

import { title, text, muted } from "@/styles/ui";
import { authClient } from "@/lib/auth-client";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const dashboardItems = {
    user: [
      { icon: Person, label: " User Profile" },
      { icon: Ticket, label: "My Booked Tickets" },
      { icon: Archive, label: "Transactions History" },
    ],
    vendor: [
      { icon: Person, label: "Vendor Profile" },
      { icon: CirclePlusFill, label: "Add Ticket" },
      { icon: Ticket, label: "My Added Tickets" },
      { icon: Envelope, label: "Requested Bookings" },
      { icon: Firewall, label: "Revenue Overview" },
    ],
    admin: [
      { icon: Person, label: "Admin Profile" },
      { icon: Ticket, label: "Manage Tickets" },
      { icon: PersonFill, label: "Manage Users" },
      { icon: Megaphone, label: "Advertise Tickets" },
    ]
  };

  // ইউজারের রোল অনুযায়ী আইটেম সিলেক্ট করা হচ্ছে, যদি রোল না থাকে তবে ডিফল্ট 'user' আইটেম দেখাবে
  const currentNavItems = dashboardItems[user?.role] || dashboardItems["user"];

  // =========================================================
  // ⚠️ শুধুমাত্র এই লোডিং ব্লকটি (isPending) যুক্ত করা হয়েছে
  // =========================================================
  if (isPending) {
    return (
      <>
        {/* মোবাইলের জন্য লোডিং বাটন */}
        <div className="md:hidden flex top-4 z-40 p-4">
          <div className="h-10 w-24 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse" />
        </div>
        
        {/* ডেস্কটপের জন্য লোডিং সাইডবার স্কেলিটন */}
        <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-white dark:bg-neutral-950 border-r border-gray-200 dark:border-neutral-900 p-6">
          <div className="animate-pulse flex flex-col gap-4 w-full">
            <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-3/4 mb-6"></div>
            <div className="h-11 bg-neutral-200 dark:bg-neutral-800 rounded-xl w-full"></div>
            <div className="h-11 bg-neutral-200 dark:bg-neutral-800 rounded-xl w-full"></div>
            <div className="h-11 bg-neutral-200 dark:bg-neutral-800 rounded-xl w-full"></div>
          </div>
        </aside>
      </>
    );
  }

  return (
    <>
      {/* =========================================================
          ১. মোবাইল ও ট্যাবলেট লেআউট (হ্যামবার্গার বাটন + ড্রয়ার)
          ========================================================= */}
      <div className="md:hidden flex top-4 z-40 p-4">
        <Button 
          variant="flat" 
          onClick={() => setIsOpen(true)}
          className={`gap-2 backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 border border-gray-200 dark:border-neutral-800 ${title}`}
        >
          <Bars />
          Menu
        </Button>
      </div>

      {/* HeroUI v3 কাস্টম ড্রয়ার */}
      <Drawer isOpen={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Backdrop>
          <Drawer.Content placement="left" className="max-w-[280px]">
            <Drawer.Dialog className="bg-white dark:bg-neutral-950 border-r border-gray-200 dark:border-neutral-900">
              <Drawer.CloseTrigger onClick={() => setIsOpen(false)} />
              <Drawer.Header>
                <Drawer.Heading className={`text-2xl font-bold ${title}`}>
                  <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent font-extrabold">
                    Ticket
                  </span>
                  <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-orange-400 bg-clip-text text-transparent font-black">
                    Bari
                  </span>
                </Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body>
                <nav className="flex flex-col gap-1.5">
                  {/* মোবাইল ড্রয়ারের ডাইনামিক আইটেমসমূহ */}
                  {currentNavItems.map((item) => (
                    <button
                      key={item.label}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-left transition-colors hover:bg-gray-100 dark:hover:bg-neutral-900 w-full ${text}`}
                      type="button"
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className={`size-5 ${muted}`} />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>

      {/* =========================================================
          ২. ডেস্কটপ লেআউট (ফিক্সড সাইডবার - স্ক্রিনের বাম পাশে থাকবে)
          ========================================================= */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-white dark:bg-neutral-950 border-r border-gray-200 dark:border-neutral-900 p-6 transition-colors">
        <div className="mb-6">
          <h2 className={`text-2xl font-bold tracking-tight ${title}`}>
            <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent font-extrabold">
              Ticket
            </span>
            <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-orange-400 bg-clip-text text-transparent font-black">
              Bari
            </span>
          </h2>
        </div>
        <nav className="flex flex-col gap-1.5">
          {/* ডেস্কটপ সাইডবারের ডাইনামিক আইটেমসমূহ */}
          {currentNavItems.map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-left transition-colors hover:bg-gray-100 dark:hover:bg-neutral-900 w-full group ${text}`}
              type="button"
            >
              <item.icon className={`size-5 transition-colors group-hover:text-blue-500 ${muted}`} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default SideBar;