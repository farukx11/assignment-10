import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  FaBars,
  FaTimes,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { SiX } from "react-icons/si";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      setDropdownOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "underline underline-offset-4 text-yellow-300"
      : "hover:text-yellow-200";

  return (
    <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide flex items-center gap-2"
        >
          <img
            src="/FinEase.png"
            alt="FinEase Logo"
            className="w-8 h-8 rounded-full"
          />
          FinEase
        </Link>

        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav
          className={`${
            menuOpen
              ? "flex flex-col absolute top-16 left-0 w-full bg-blue-700 py-4 md:static md:flex-row md:space-x-6"
              : "hidden md:flex md:space-x-6"
          } items-center transition-all duration-300`}
        >
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          {user && (
            <>
              <NavLink to="/add-transaction" className={navLinkClass}>
                Add Transaction
              </NavLink>
              <NavLink to="/my-transactions" className={navLinkClass}>
                My Transactions
              </NavLink>
              <NavLink to="/reports" className={navLinkClass}>
                Reports
              </NavLink>
            </>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                className="px-3 py-1 bg-white text-blue-600 rounded hover:bg-gray-100 font-semibold"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 bg-white text-blue-600 rounded hover:bg-gray-100 font-semibold"
              >
                Signup
              </Link>
            </>
          ) : (
            <div className="relative">
              <img
                src={user.photoURL || "https://via.placeholder.com/40"}
                alt="User"
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-white hover:scale-105 transition"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white text-black rounded-lg shadow-lg z-50 animate-fadeIn">
                  <div className="p-3 border-b">
                    <p className="font-semibold text-gray-800">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>

                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 font-medium"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>

                  {/* Social Media Icons */}
                  <div className="flex justify-around p-3 border-t text-gray-700">
                    <a
                      href="https://www.facebook.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600"
                    >
                      <FaFacebookF />
                    </a>
                    <a
                      href="https://www.instagram.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-pink-600"
                    >
                      <FaInstagram />
                    </a>
                    <a
                      href="https://www.linkedin.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-500"
                    >
                      <FaLinkedinIn />
                    </a>
                    <a
                      href="https://twitter.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-black"
                    >
                      <SiX />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
