import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGO_URL as string);
const db = client.db("online-ticket-booking-platform");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: { 
    enabled: true, 
  },

  // 🔗 অ্যাকাউন্ট লিঙ্কিং সেটিংস (ইমেইল এবং গুগল অ্যাকাউন্ট মার্জ করার জন্য)
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"], // আপনি যেহেতু গুগল ব্যবহার করছেন
    },
  },

  // 🌐 সোশ্যাল প্রোভাইডার সেটিংস
  socialProviders: {
    google: { 
      clientId: process.env.GOOGLE_CLIENT_ID , 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET , 
    }, 
  },

  // 👤 ইউজার স্কিমা ও ডিফল্ট রোল 'user' সেট করা
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user", // নতুন সাইন-আপ করলেই অটোমেটিক 'user' রোল পাবে
      },
    },
  },
});