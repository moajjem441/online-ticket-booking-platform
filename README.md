# 🎫 Ticket Booking & Management System

A modern, full-stack, and completely responsive Ticket Booking and Management ecosystem built with **Next.js (App Router)**, **Node.js/Express**, and **MongoDB**. The platform streamlines the workflow between customers looking to buy tickets/routes and vendors reviewing bookings, backed by safe payment tracking and responsive, multi-device layouts.

🔗 **Live Application URL:** [Insert Your Live Vercel/Production URL Here]

---

## 🎯 Purpose
The goal of this project is to provide a seamless, secure, and intuitive bridge between vendors and ticket consumers. It eliminates manual verification delays by introducing automated transaction matching, secure session-based authentication guards, and a dedicated responsive panel that works smoothly on mobile phones, tablets, and wide desktop screens.

---

## 🚀 Key Features

### 👤 Customer Features
* **Adaptive Transaction History:** A highly scannable grid-card view for mobile and tablet touchpoints, transforming into a data-rich tabular dashboard on desktops.
* **Stripe Payment Tracking:** Displays authenticated payment records directly linked to user email sessions, ensuring immediate confirmation.
* **Dynamic Route Guarding:** Middleware filters out unauthenticated requests from sensitive pages like `/tickets/*` and securely redirects to login.

### 🏢 Vendor Features
* **Requested Bookings Dashboard:** A real-time control room where vendors inspect incoming ticket orders and access operational metrics.
* **Stateful Actions:** Instant *Accept* or *Reject* actions complete with granular loading trackers to prevent overlapping database writes.
* **Stock Optimization:** Seamless updates to `bookingQuantity` and inventory synchronization upon vendor approval.

### 🛠️ Core UI & DX Highlights
* **Universal Responsiveness:** Uses a tailored Tailwind breakpoint matrix (`grid-cols-1 md:grid-cols-2 lg:block`) ensuring no screen size feels like an afterthought.
* **Micro-Interactions & Hover Feedback:** Clean, tactile hover animations, button scaling (`active:scale-95`), and theme-aware focus states.
* **Real-time Notifications:** Smooth, unobtrusive validation toasts handled natively.

---

## 📦 Core NPM Packages Used

### 🖥️ Frontend (Next.js Application)
| Package | Version / Purpose |
| :--- | :--- |
| **`react`** | Core library for component architecture |
| **`next`** | Framework powering file-based App Router, Middleware, and optimized builds |
| **`react-hot-toast`** | Programmatic context banners and asynchronous status notifications |
| **`tailwindcss`** | Utility-first CSS styling Engine |
| **`daisyui`** | Component library for accessible and rapid component theming |

### ⚙️ Backend (Express Server)
| Package | Version / Purpose |
| :--- | :--- |
| **`express`** | Fast, minimalist web framework for building standard REST endpoints |
| **`mongoose`** | Object Data Modeling (ODM) for schema validation with MongoDB |
| **`cors`** | Middleware enabling Cross-Origin Resource Sharing controls |
| **`dotenv`** | Zero-dependency module that loads environment variables from a `.env` file |

---

## 🛠️ Installation & Local Setup

### 1. Clone the repository
```bash
git clone [https://github.com/moajjem441/your-repo-name.git](https://github.com/moajjem441/your-repo-name.git)
cd your-repo-name





2. Backend Setup
Navigate to your server folder and install production dependencies:

Bash
cd backend
npm install
Create a .env file in the root of your backend directory:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
Boot the Express instance:

Bash
npm start
3. Frontend Setup
Navigate to your Next.js workspace and run setup:

Bash
cd ../frontend
npm install
Create a local .env.local file inside the frontend folder:

Code snippet
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
Run the development server with Turbopack or standard Webpack options:

Bash
npm run dev
🌐 Serverless Deployment (vercel.json)
To spin up the Node/Express backend seamlessly inside Vercel’s serverless runtimes while entirely resolving CORS pre-flight pre-requests, the following structure is implemented:

JSON
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js",
      "headers": {
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
        "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
      }
    }
  ]
}
🔒 Security Practices
Environment Integrity: Sensitive API paths, security headers, database links, and caching artifacts (node_modules/, .env) are explicitly isolated out of public git indexes utilizing an optimized .gitignore standard.

Developed with 💙 by Moajjem Hossain


### 💡 Quick Tips Before Staging:
1. Replace `[Insert Your Live Vercel/Production URL Here]` with your true application link once it builds successfully.
2. Adjust your clone target route (`your-repo-name`) to perfectly align with your current GitHub setup.