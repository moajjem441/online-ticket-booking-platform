"use client";
import React, { useState } from "react";
import {
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
import Link from "next/link";
import { FaBus } from "react-icons/fa";
import { HiChevronDown, HiMenu, HiX } from "react-icons/hi";
import ThemeToggleButton from "./ThemeToggleButton";

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // সেশন ডেটা সিমুলেশন (আপনার অথেন্টিকেশন সিস্টেম থেকে বাস্তব session দিন)
  const session = {
    user: {
      name: "John Doe",
      email: "john@ticketbari.com",
      image: "https://img.heroui.chat/image/avatar?w=400&h=400&u=3",
    }
  };

  const isLoggedIn = !!session?.user;

  const getFallbackText = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "All Tickets", href: "/tickets" },
    ...(isLoggedIn ? [{ label: "Dashboard", href: "/dashboard" }] : []),
  ];

  return (
    <div className="w-full px-4 pt-6 fixed top-0 z-50 max-w-7xl mx-auto left-0 right-0">
      <nav className="flex items-center justify-between bg-neutral-900/40 backdrop-blur-md border border-neutral-800 rounded-2xl h-20 px-6 shadow-2xl transition-all duration-300">
        
        {/* বাম পাশ: লোগো ও মোবাইল মেনু টগল */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden text-white text-2xl focus:outline-none mr-1"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <HiX /> : <HiMenu />}
          </button>
          
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight select-none">
            <FaBus className="text-blue-500 text-2xl" />
            <span className="bg-gradient-to-r from-violet-600 via-indigo-400 to-white bg-clip-text text-transparent font-extrabold">
              Ticket
            </span>
            <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-orange-400 bg-clip-text text-transparent font-black drop-shadow-[0_0_12px_rgba(244,63,94,0.3)]">
              Bari
            </span>
          </Link>
        </div>

        {/* মাঝের অংশ: ডেক্সটপ নেভিগেশন */}
        <div className="hidden sm:flex items-center gap-6">
          <Link href="/" className="text-neutral-300 hover:text-white text-sm font-medium transition-colors">
            Home
          </Link>
          <Link href="/tickets" className="text-neutral-300 hover:text-white text-sm font-medium transition-colors">
            All Tickets
          </Link>
          {isLoggedIn && (
            <Link href="/dashboard" className="text-neutral-300 hover:text-white text-sm font-medium transition-colors">
              Dashboard
            </Link>
          )}
        </div>

        {/* ডান পাশ: থিম টগল + ইউজার ড্রপডাউন / সাইন-ইন */}
        <div className="flex items-center gap-4">
          
          {/* ✅ থিম টগল বাটন – ড্রপডাউনের বাইরে */}
          <ThemeToggleButton />

          {isLoggedIn ? (
            <Dropdown placement="bottom-end" className="bg-neutral-900 border border-neutral-800 text-white">
              <DropdownTrigger>
                {/* ✅ এখানে শুধু ড্রপডাউন ট্রিগার, কোনো নেস্টেড বাটন নেই */}
                <div className="flex items-center gap-2 py-1.5 px-3 rounded-full hover:bg-neutral-800/50 cursor-pointer border border-neutral-800/40 transition-all">
                  <Avatar className="w-8 h-8 text-xs border border-blue-500/50">
                    {session.user.image ? (
                      <Avatar.Image alt={session.user.name} src={session.user.image} />
                    ) : null}
                    <Avatar.Fallback>{getFallbackText(session.user.name)}</Avatar.Fallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium text-neutral-200">
                    {session.user.name}
                  </span>
                  <HiChevronDown className="text-neutral-400 text-sm hidden md:block" />
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="my-profile" textValue="My Profile">
                  <Link href="/profile" className="w-full h-full block text-neutral-200">My Profile</Link>
                </DropdownItem>
                <DropdownItem key="logout" color="danger" className="text-danger" textValue="Logout">
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Link 
              href="/login" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 hover:opacity-90 transition-all text-sm block"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* মোবাইল ড্রয়ার মেনু */}
      {isMenuOpen && (
        <div className="sm:hidden absolute top-28 left-4 right-4 bg-neutral-950/95 backdrop-blur-lg rounded-2xl p-6 border border-neutral-800 shadow-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-5 duration-200">
          {menuItems.map((item, index) => (
            <Link 
              key={`${item.label}-${index}`}
              className="w-full text-neutral-200 text-lg py-2 block border-b border-neutral-900 last:border-0" 
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {!isLoggedIn && (
            <>
              <div className="w-full h-[1px] bg-neutral-800 my-2" />
              <Link 
                href="/login" 
                className="w-full text-blue-400 text-lg py-2 block"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}