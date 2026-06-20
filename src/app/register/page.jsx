"use client";
import React, { useState } from "react";
import { Input, Button } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaBus, FaGoogle } from "react-icons/fa";
// import { authClient } from "@/lib/auth-client";
// আপনার ডিজাইন টোকেনসমূহ ইমপোর্ট করুন
import { card, title, text, muted, buttonPrimary } from "@/styles/ui";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    console.log(name, email, password);

    const { data, error: authError } = await authClient.signUp.email({
      email,
      password,
      name,
      callbackURL: "/", 
    });

    if (authError) {
      setError(authError.message || "Something went wrong!");
      setLoading(false);
    } else {
      router.push("/");
    }
  };

//   const handleGoogleLogin = async () => {
//     await authClient.signIn.social({
//       provider: "google",
//       callbackURL: "/",
//     });
  
// };

  return (
    <div className="w-full min-h-[85vh] flex items-center justify-center px-4 relative transition-colors">
      {/* Background Glows (ডার্ক মোডে সুন্দর দেখানোর জন্য) */}
      <div className="absolute w-[400px] h-[400px] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[100px] top-1/4 left-1/4 pointer-events-none" />
      
      {/* ⚠️ এখানে কার্ড টোকেন ব্যবহার করা হয়েছে */}
      <div className={`w-full max-w-md p-8 shadow-2xl z-10 ${card}`}>
        
        <div className="flex flex-col items-center gap-2 mb-6">
          <FaBus className="text-blue-500 text-3xl" />
          {/* ⚠️ টাইটেল টোকেন */}
          <h2 className={`text-2xl font-bold ${title}`}>Create an Account</h2>
          {/* ⚠️ মিউটেড টেক্সট টোকেন */}
          <p className={`text-xs ${muted}`}>Join TicketBari to book tickets instantly</p>
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-xl mb-4 border border-red-500/20">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input 
            name="name" 
            type="text" 
            label="Full Name" 
            placeholder="Enter your name" 
            required 
            variant="bordered" 
            className={{ label: text, input: title }}
          />
          <Input 
            name="email" 
            type="email" 
            label="Email" 
            placeholder="Enter your email" 
            required 
            variant="bordered" 
            className={{ label: text, input: title }}
          />
          <Input 
            name="password" 
            type="password" 
            label="Password" 
            placeholder="Enter your password" 
            required 
            variant="bordered" 
            className={{ label: text, input: title }}
          />
          
          {/* ⚠️ প্রাইমারি বাটন টোকেন */}
          <Button 
            type="submit" 
            isLoading={loading} 
            className={`w-full h-12 rounded-xl mt-2 shadow-lg shadow-indigo-600/10 ${buttonPrimary}`}
          >
            Sign Up
          </Button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-[1px] bg-gray-200 dark:bg-neutral-800" />
          <span className={`px-3 text-xs uppercase ${muted}`}>Or</span>
          <div className="flex-1 h-[1px] bg-gray-200 dark:bg-neutral-800" />
        </div>

        {/* Google Social Button */}
        <Button 
        //   onClick={handleGoogleLogin} 
          variant="bordered" 
          className={`w-full border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 font-medium h-12 rounded-xl gap-2 ${title}`}
        >
          <FaGoogle className="text-red-500" /> Continue with Google
        </Button>

        {/* ⚠️ টেক্সট টোকেন */}
        <p className={`text-sm text-center mt-6 ${text}`}>
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline font-medium">Log In</Link>
        </p>
      </div>
    </div>
  );
}