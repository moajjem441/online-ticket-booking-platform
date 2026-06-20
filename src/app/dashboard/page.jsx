// app/dashboard/page.js
export default function DashboardPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
        Welcome to Dashboard! 🎉
      </h1>
      <p className="text-gray-600 dark:text-neutral-300 ">
        Here you can manage your tickets and bookings.
      </p>
    </div>
  );
}