"use client";

import React from "react";
import Link from "next/link";
import { FaBus, FaFacebook, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { FaCcStripe, FaCcVisa, FaCcMastercard } from "react-icons/fa6";

import { usePathname } from "next/navigation";

export default function Footer() {

  const pathname=usePathname();

  if(pathname.includes("dashboard")){
    return null;
  }

  return (
    <footer className="w-full bg-white dark:bg-neutral-950 border-t border-gray-200 dark:border-neutral-900 text-gray-600 dark:text-neutral-400 pt-16 pb-8 px-6 mt-auto transition-colors duration-300">

      {/* 4 Columns */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 xl:gap-12">

        {/* Column 1 */}
        <div className="flex flex-col gap-4">

          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight select-none">

            <FaBus className="text-blue-500 text-2xl" />

            <span className="bg-gradient-to-r from-violet-600 via-indigo-400 to-blue-500 bg-clip-text text-transparent font-extrabold">
              Ticket
            </span>

            <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-orange-400 bg-clip-text text-transparent font-black">
              Bari
            </span>

          </Link>

          <p className="text-sm font-light leading-relaxed max-w-xs text-gray-600 dark:text-neutral-400">
            Book bus, train, launch & flight tickets easily from anywhere, anytime. Your reliable journey partner.
          </p>

        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-4">

          <h4 className="text-gray-900 dark:text-white font-semibold text-sm uppercase tracking-wider">
            Quick Links
          </h4>

          <ul className="flex flex-col gap-2.5 text-sm">

            <li>
              <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">
                Home
              </Link>
            </li>

            <li>
              <Link href="/tickets" className="hover:text-black dark:hover:text-white transition-colors">
                All Tickets
              </Link>
            </li>

            <li>
              <Link href="/contact" className="hover:text-black dark:hover:text-white transition-colors">
                Contact Us
              </Link>
            </li>

            <li>
              <Link href="/about" className="hover:text-black dark:hover:text-white transition-colors">
                About
              </Link>
            </li>

          </ul>

        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-4">

          <h4 className="text-gray-900 dark:text-white font-semibold text-sm uppercase tracking-wider">
            Contact Info
          </h4>

          <ul className="flex flex-col gap-3 text-sm">

            <li className="flex items-center gap-2.5">
              <FaEnvelope className="text-blue-500 text-base" />
              <a href="mailto:support@ticketbari.com" className="hover:text-black dark:hover:text-white transition-colors">
                support@ticketbari.com
              </a>
            </li>

            <li className="flex items-center gap-2.5">
              <FaPhoneAlt className="text-emerald-500 text-base" />
              <a href="tel:+880123456789" className="hover:text-black dark:hover:text-white transition-colors">
                +880 1234-567890
              </a>
            </li>

            <li className="flex items-center gap-2.5">
              <FaFacebook className="text-indigo-500 text-base" />
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="hover:text-black dark:hover:text-white transition-colors">
                TicketBari Official
              </a>
            </li>

          </ul>

        </div>

        {/* Column 4 */}
        <div className="flex flex-col gap-4">

          <h4 className="text-gray-900 dark:text-white font-semibold text-sm uppercase tracking-wider">
            Payment Methods
          </h4>

          <p className="text-xs text-gray-500 dark:text-neutral-500">
            We accept secure global payments via Stripe and popular cards.
          </p>

          <div className="flex items-center gap-3 text-3xl text-gray-400 dark:text-neutral-500 mt-1">

            <FaCcStripe className="hover:text-[#635bff] transition-colors cursor-pointer" />

            <FaCcVisa className="hover:text-[#1a1f71] transition-colors cursor-pointer" />

            <FaCcMastercard className="hover:text-[#eb001b] transition-colors cursor-pointer" />

          </div>

        </div>

      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto h-[1px] bg-gray-200 dark:bg-neutral-900 my-10" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-gray-500 dark:text-neutral-600 text-center sm:text-left">

        <p>© 2025 TicketBari. All rights reserved.</p>

        <div className="flex gap-4">

          <Link href="/privacy" className="hover:text-black dark:hover:text-white transition-colors">
            Privacy Policy
          </Link>

          <Link href="/terms" className="hover:text-black dark:hover:text-white transition-colors">
            Terms of Service
          </Link>

        </div>

      </div>

    </footer>
  );
}