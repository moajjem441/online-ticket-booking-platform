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
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              icon: '✅',
            },
            error: {
              duration: 4000,
              icon: '❌',
            },
          }}
        />

       
      </body>
    </html>
  );
}