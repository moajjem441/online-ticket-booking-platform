"use client";

import React, { useState } from "react";
import Link from "next/link"; // 👈 ইমপোর্ট করুন
import {
  Bars,
  Person,
  Ticket,
  Archive,
  CirclePlusFill,
  Envelope,
  Firewall,
  PersonFill,
  Megaphone,
} from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";

import { title, text, muted } from "@/styles/ui";
import { authClient } from "@/lib/auth-client";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // প্রতিটি আইটেমের সাথে href যোগ করা হলো
  const dashboardItems = {
    user: [
      { icon: Person, label: "User Profile", href: "/dashboard/user/profile" },
      { icon: Ticket, label: "My Booked Tickets", href: "/dashboard/user/my-bookings" },
      { icon: Archive, label: "Transactions History", href: "/dashboard/user/transactions" },
    ],
    vendor: [
      { icon: Person, label: "Vendor Profile", href: "/dashboard/vendor/profile" },
      { icon: CirclePlusFill, label: "Add Ticket", href: "/dashboard/vendor/add-ticket" },
      { icon: Ticket, label: "My Added Tickets", href: "/dashboard/vendor/my-added-tickets" },
      { icon: Envelope, label: "Requested Bookings", href: "/dashboard/vendor/requested-bookings" },
      { icon: Firewall, label: "Revenue Overview", href: "/dashboard/vendor/revenue" },
    ],
    admin: [
      { icon: Person, label: "Admin Profile", href: "/dashboard/admin/profile" },
      { icon: Ticket, label: "Manage Tickets", href: `/dashboard/admin/manage-ticket` },
      { icon: PersonFill, label: "Manage Users", href: "/dashboard/admin/manage-users" },
      { icon: Megaphone, label: "Advertise Tickets", href: "/dashboard/admin/promote-tickets" },
    ],
  };

  const currentNavItems = dashboardItems[user?.role] || dashboardItems["user"];

  if (isPending) {
    return (
      <>
        <div className="md:hidden flex top-4 z-40 p-4">
          <div className="h-10 w-24 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse" />
        </div>
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
      {/* মোবাইল হ্যামবার্গার */}
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

      {/* মোবাইল ড্রয়ার */}
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
                  {currentNavItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-left transition-colors hover:bg-gray-100 dark:hover:bg-neutral-900 w-full ${text}`}
                      onClick={() => setIsOpen(false)} // ড্রয়ার বন্ধ
                    >
                      <item.icon className={`size-5 ${muted}`} />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>

      {/* ডেস্কটপ সাইডবার */}
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
          {currentNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-left transition-colors hover:bg-gray-100 dark:hover:bg-neutral-900 w-full group ${text}`}
            >
              <item.icon className={`size-5 transition-colors group-hover:text-blue-500 ${muted}`} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default SideBar;