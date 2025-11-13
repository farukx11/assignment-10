import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/FinEase.png";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Add Transaction", path: "/add-transaction", protected: true },
    { name: "My Transactions", path: "/my-transactions", protected: true },
    { name: "Reports", path: "/reports", protected: true },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white rounded-xl mx-4 my-3 px-6 py-3 flex justify-between items-center shadow-md relative z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <img
          src={logo}
          alt="FinEase Logo"
          className="w-10 h-10 object-contain"
        />
        <span className="text-xl font-extrabold text-[#144C52]">FinEase</span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-4 text-[#2E3A59]">
        {navLinks.map((link) => {
          if (link.protected && !user) return null;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`font-medium hover:text-blue-600 transition-colors ${
                isActive(link.path) ? "text-blue-600 underline" : ""
              }`}
            >
              {link.name}
            </Link>
          );
        })}

        {user ? (
          <div
            className="flex items-center space-x-3 relative"
            ref={dropdownRef}
          >
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt="User"
              className="w-10 h-10 rounded-full cursor-pointer border border-gray-200 hover:border-blue-500 transition-all"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />

            {dropdownOpen && (
              <div className="absolute top-full mt-6 right-0 w-56 bg-white border rounded-2xl shadow-lg py-3 z-50 animate-fadeIn">
                <div className="px-4 mb-2">
                  <p className="font-medium">{user.displayName || "User"}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors font-medium ${
                    loggingOut ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loggingOut ? "Logging Out..." : "Log Out"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Signup
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-[#2E3A59] focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute left-0 w-full bg-white rounded-xl flex flex-col items-center py-4 space-y-2 z-40 shadow-lg transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "max-h-[1000px] opacity-100 top-full mt-2"
            : "max-h-0 opacity-0 top-full mt-2 overflow-hidden pointer-events-none"
        }`}
      >
        {navLinks.map((link) => {
          if (link.protected && !user) return null;
          return (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`font-medium hover:text-blue-600 transition-colors w-3/4 text-center py-2 rounded-none ${
                isActive(link.path) ? "text-blue-600 underline" : ""
              }`}
            >
              {link.name}
            </Link>
          );
        })}

        {user ? (
          <div className="flex flex-col items-center space-y-2 mt-2 w-3/4">
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt="User"
              className="w-10 h-10 rounded-full"
            />
            <div className="text-sm text-gray-700 text-center">
              <p className="font-medium">{user.displayName || "User"}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-24 cursor-pointer ${
                loggingOut ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loggingOut ? "Logging Out..." : "Log Out"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2 mt-2 w-full">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-24 text-center"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-24 text-center"
            >
              Signup
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
