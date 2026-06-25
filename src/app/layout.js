import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppNavbar from "@/components/Navbar";
import NextThemeProviders from "@/providers/NextThemeProviders";
import Footer from "@/components/Footer";

import { Toaster } from "react-hot-toast";

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
    <html
      lang="en" 
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} // ✅ 'dark' সরানো হয়েছে
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground min-h-full flex flex-col">
    <NextThemeProviders>

      <AppNavbar />
          <main className="flex-1">
            {children}
          </main>
         
          <Footer></Footer>
    </NextThemeProviders>
          

          <Toaster 
  position="top-right"
  toastOptions={{
    duration: 4000,
    // Base professional styling for the toast container
    style: {
      background: 'rgba(255, 255, 255, 0.8)', // Light mode: clean semi-transparent white
      color: '#1a1a1a',                       // Dark gray text for high contrast in light mode
      backdropFilter: 'blur(12px)',           // Premium modern glassmorphism effect
      WebkitBackdropFilter: 'blur(12px)',     // Safari support
      border: '1px solid rgba(0, 0, 0, 0.05)', // Barely visible light border
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
      borderRadius: '12px',                   // Perfectly rounded matching your UI cards
      fontSize: '14px',
      fontWeight: '500',
      padding: '12px 20px',
      fontFamily: 'sans-serif',
    },
    // Theme-specific overrides or specialized types
    success: {
      duration: 3000,
      icon: '✨', // Modern sparkling icon instead of the traditional harsh checkmark
      style: {
        // In dark mode, it switches smoothly to match your #0d0811 theme canvas
        background: 'rgba(13, 8, 17, 0.75)', 
        color: '#fff',
        border: '1px solid rgba(34, 197, 94, 0.3)', // Emerald/Green glowing border
        boxShadow: '0 4px 20px 0 rgba(34, 197, 94, 0.15)', // Neon glow effect
      },
    },
    error: {
      duration: 4000,
      icon: '💥', // Eye-catching modern error icon
      style: {
        background: 'rgba(13, 8, 17, 0.75)',
        color: '#fff',
        border: '1px solid rgba(239, 68, 68, 0.3)', // Rose/Red glowing border
        boxShadow: '0 4px 20px 0 rgba(239, 68, 68, 0.15)', // Neon error glow
      },
    },
  }}
/>

       
      </body>
    </html>
  );
}