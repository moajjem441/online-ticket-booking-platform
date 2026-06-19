import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import AppNavbar from "@/components/Navbar"; 
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TicketBari - Online Ticket Booking Platform",
  description: "Book your bus and train tickets easily",
};

export default function RootLayout({ children }) {
  return (
    <html class="light" data-theme="light"
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning // এটি এখানে ঠিক আছে
    >
      {/* ২. body থেকে ভুল suppressHydrationWarning ক্লাসটি মুছে ফেলা হয়েছে */}
      <body className="bg-background text-foreground min-h-full flex flex-col">
        <Providers>
          {/* ৩. এখানেও AppNavbar ট্যাগ ব্যবহার করা হয়েছে */}
          <AppNavbar /> 

          {/* নেভবারটি যেহেতু fixed করা, তাই মেইন কন্টেন্ট যেন নেভবারের নিচে ঢুকে না যায়, 
              সেজন্য main ট্যাগে সামান্য টপ প্যাডিং (pt-28) দেওয়া ভালো */}
          <main className="flex-1 pt-28"> 
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}