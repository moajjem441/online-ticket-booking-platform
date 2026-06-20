"use client";
import React, { useEffect, useState } from "react";
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
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession(); // isPending যোগ করুন
  const user = session?.user;

  useEffect(() => {
    setMounted(true);
  }, []);

  // রিডাইরেক্ট শুধুমাত্র mounted && !isPending && !user হলে
  useEffect(() => {
    if (mounted && !isPending && !user) {
      router.push("/login");
    }
  }, [mounted, isPending, user, router]);

  // ফallback টেক্সট
  const getFallbackText = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";


  const menuItems = [
    { label: "Home", href: "/" },
    { label: "All Tickets", href: "/tickets" },
    ...(user ? [{ label: "Dashboard", href: "/dashboard" }] : []),
  ];

  const handleSignout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const navClasses = `
    flex items-center justify-between
    bg-white dark:bg-neutral-900/40
    backdrop-blur-md
    border border-gray-200 dark:border-neutral-800
    rounded-2xl h-20 px-6 shadow-xl
    transition-colors duration-300
  `.trim();

  return (
    <div className="w-full px-4 pt-6 fixed top-0 z-50 max-w-7xl mx-auto left-0 right-0">
      <nav className={navClasses}>
        {/* LEFT - ঠিক আছে */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden text-gray-800 dark:text-white text-2xl"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <HiX /> : <HiMenu />}
          </button>
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <FaBus className="text-blue-500 text-2xl" />
            <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent font-extrabold">
              Ticket
            </span>
            <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-orange-400 bg-clip-text text-transparent font-black">
              Bari
            </span>
          </Link>
        </div>

        {/* CENTER - সার্ভার/ক্লায়েন্ট মিলিয়ে দিতে হবে */}
        <div className="hidden sm:flex items-center gap-6">
          <Link href="/" className="text-gray-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition">
            Home
          </Link>
          <Link href="/tickets" className="text-gray-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition">
            All Tickets
          </Link>
          {/* Dashboard শুধু দেখাবেন যখন mounted && user true */}
          {mounted && user && (
            <Link href="/dashboard" className="text-gray-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition">
              Dashboard
            </Link>
          )}
        </div>

        {/* RIGHT - মূল হাইড্রেশন ফিক্স */}
        <div className="flex items-center gap-4">
          <ThemeToggleButton />

          {/* যদি mounted false অথবা isPending true হয়, তাহলে সার্ভারের মতো Sign In দেখান */}
          {!mounted || isPending ? (
            <Link
              href="/login"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium"
            >
              Sign In
            </Link>
          ) : user ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <div className="flex items-center gap-2 py-1.5 px-3 rounded-full border border-gray-200 dark:border-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-800/50 cursor-pointer transition">
                  <Avatar className="w-8 h-8">
                    {user.image && <Avatar.Image alt={user.name} src={user.image} />}
                    <Avatar.Fallback>{getFallbackText(user.name)}</Avatar.Fallback>
                  </Avatar>
                  <span className="hidden md:block text-sm text-gray-800 dark:text-neutral-200">
                    {user.name}
                  </span>
                  <HiChevronDown className="text-gray-500 dark:text-neutral-400 hidden md:block" />
                </div>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="profile">
                  <Link href="/profile">My Profile</Link>
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onPress={handleSignout}>
                  <span className="text-red-500">Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Link
              href="/login"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* মোবাইল মেনু */}
      {isMenuOpen && (
        <div className="sm:hidden absolute top-28 left-4 right-4 bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-700 dark:text-neutral-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}