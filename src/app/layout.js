import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppNavbar from "@/components/Navbar";
import NextThemeProviders from "@/providers/NextThemeProviders";


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
          <main className="flex-1 pt-28">
            {children}
          </main>
    </NextThemeProviders>
          
       
      </body>
    </html>
  );
}