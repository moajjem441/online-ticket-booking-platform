// app/dashboard/layout.js
import SideBar from "@/components/dashboard/SideBar";
import Navbar from "@/components/dashboard/Navbar";  // আলাদা Navbar কম্পোনেন্ট ইমপোর্ট করুন
import UserPage from "./user/page";

export default function DashBoardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* সাইডবার - বাম পাশে ফিক্সড */}
      <aside className="  bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700 p-4">
        <SideBar />
      </aside>

      {/* ডান পাশের কন্টেন্ট */}
      <div className="flex-1 flex flex-col">
        {/* নেভবার - উপরে */}
        <header className="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 p-4">
          <Navbar />
        </header>

        {/* পেজ কন্টেন্ট - এখানে children রেন্ডার হবে */}
        <main className="flex-1 p-6 overflow-auto">
          {children}

          <UserPage></UserPage>
        </main>
      </div>
    </div>
  );
}