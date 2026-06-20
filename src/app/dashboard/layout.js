export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <aside className="w-64 bg-gray-100 p-4">
          Sidebar
        </aside>
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow p-4">
            Navbar
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}