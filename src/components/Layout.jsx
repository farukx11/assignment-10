import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header"; // তোমার updated Header
import Footer from "./Footer";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {/* Header/Navbar */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer user={user} />
    </div>
  );
};

export default Layout;
