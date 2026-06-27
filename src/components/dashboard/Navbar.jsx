// components/dashboard/Navbar.jsx
"use client";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-lg font-bold">{user?.name}</span>
<button 
  onClick={handleLogout} 
  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-rose-950/30 px-4 py-2 rounded-xl text-lg font-bold transition-all duration-200 active:scale-95 cursor-pointer"
>
  Logout
</button>      </div>
    </div>
  );
}