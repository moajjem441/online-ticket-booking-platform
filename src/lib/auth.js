import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGO_URL );
const db = client.db("online-ticket-booking-platform");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: { 
    enabled: true, 
  },


  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"], 
    },
  },

  
  socialProviders: {
    google: { 
      clientId: process.env.GOOGLE_CLIENT_ID , 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET , 
    }, 
  },

  
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user", 
      },
    },
  },

  session: {
    cookieCache:{
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    }
  },
  plugins: [
   jwt()
  ],


});