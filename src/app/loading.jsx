import { title, text, muted, buttonPrimary } from "@/styles/ui";


const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-300">
      <div className="relative flex justify-center items-center">
        <div className="absolute w-24 h-24 rounded-full border-4 border-blue-100 dark:border-blue-900/30 animate-ping"></div>
        <div className="relative w-16 h-16 rounded-full border-t-4 border-b-4 border-blue-600 dark:border-blue-400 animate-spin"></div>
      </div>
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight animate-pulse">
          TicketBari
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest mt-1">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loading;