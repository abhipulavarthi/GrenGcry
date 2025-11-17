import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="bg-[#FAFAFA] text-gray-900 min-h-screen">

      {/* Navigation Bar */}
      <nav className="bg-brand-steel text-white p-4 shadow-md sticky top-0 z-20">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">🛒 FreshCart</Link>
          <ul className="flex space-x-6">
            <li><Link to="/" className="hover:text-brand-sand font-semibold">Home</Link></li>
            <li><Link to="/login" className="hover:text-brand-sand font-semibold">Login</Link></li>
            <li><Link to="/admin" className="hover:text-brand-sand font-semibold">Admin</Link></li>
          </ul>
        </div>
      </nav>

      {/* Page content will be rendered here */}
      <main className="container mx-auto mt-2">
        <Outlet />
      </main>
    </div>
  );
}