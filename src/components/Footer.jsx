"use client";
import React from "react";
import Link from "next/link";
import { FaBus, FaFacebook, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { FaCcStripe, FaCcVisa, FaCcMastercard } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full bg-neutral-950 border-t border-neutral-900 text-neutral-400 pt-16 pb-8 px-6 mt-auto">
      {/* 4 Columns Wrapper */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 xl:gap-12">
        
        {/* Column 1: Logo + Description */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight select-none">
            <FaBus className="text-blue-500 text-2xl" />
            <span className="bg-gradient-to-r from-violet-600 via-indigo-400 to-white bg-clip-text text-transparent font-extrabold">
              Ticket
            </span>
            <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-orange-400 bg-clip-text text-transparent font-black drop-shadow-[0_0_12px_rgba(244,63,94,0.3)]">
              Bari
            </span>
          </Link>
          <p className="text-sm font-light leading-relaxed max-w-xs text-neutral-400">
            Book bus, train, launch & flight tickets easily from anywhere, anytime. Your reliable journey partner.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link href="/" className="hover:text-white hover:underline transition-all">Home</Link>
            </li>
            <li>
              <Link href="/tickets" className="hover:text-white hover:underline transition-all">All Tickets</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white hover:underline transition-all">Contact Us</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white hover:underline transition-all">About</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Contact Info</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-center gap-2.5">
              <FaEnvelope className="text-blue-500 text-base" />
              <a href="mailto:support@ticketbari.com" className="hover:text-white transition-colors">
                support@ticketbari.com
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <FaPhoneAlt className="text-emerald-500 text-base" />
              <a href="tel:+880123456789" className="hover:text-white transition-colors">
                +880 1234-567890
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <FaFacebook className="text-indigo-500 text-base" />
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                TicketBari Official
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Payment Methods */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Payment Methods</h4>
          <p className="text-xs text-neutral-500">We accept secure global payments via Stripe and popular cards.</p>
          <div className="flex items-center gap-3 text-3xl text-neutral-500 mt-1">
            <FaCcStripe className="hover:text-[#635bff] transition-colors cursor-pointer" title="Stripe" />
            <FaCcVisa className="hover:text-[#1a1f71] transition-colors cursor-pointer" title="Visa" />
            <FaCcMastercard className="hover:text-[#eb001b] transition-colors cursor-pointer" title="Mastercard" />
          </div>
        </div>

      </div>

      {/* Divider Line */}
      <div className="max-w-7xl mx-auto h-[1px] bg-neutral-900 my-10" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-neutral-600 text-center sm:text-left">
        <p>© 2025 TicketBari. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-neutral-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-neutral-400 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}