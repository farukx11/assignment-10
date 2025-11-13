import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaMapMarkerAlt,
  FaEnvelope,
} from "react-icons/fa";
import { SiX } from "react-icons/si";
import logo from "../assets/FinEase.png";

const Footer = ({ user }) => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Add Transaction", path: "/add-transaction", protected: true },
    { name: "My Transactions", path: "/my-transactions", protected: true },
    { name: "Reports", path: "/reports", protected: true },
    { name: "Terms & Conditions", path: "/terms-and-conditions" },
    { name: "Privacy Policy", path: "/privacy-policy" },
  ];

  return (
    <footer className="bg-[#142B3C] text-white pt-12 pb-6">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-10 md:gap-x-32 px-6">
        {/* Logo & Description */}
        <div>
          <div className="flex items-center mb-3 space-x-2">
            <img
              src={logo}
              alt="FinEase Logo"
              className="w-10 h-10 object-contain rounded-xl"
            />
            <span className="text-2xl font-semibold text-white">FinEase</span>
          </div>
          <p className="text-gray-300 mb-4 leading-relaxed">
            FinEase is a personal finance platform to manage your income,
            expenses, and savings efficiently.
          </p>

          <h3 className="font-semibold mb-2 text-gray-200">Connect With Us</h3>
          <div className="flex space-x-4 text-lg">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition-colors"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition-colors"
            >
              <SiX />
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition-colors"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition-colors"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Pages</h2>
          <ul className="space-y-2 text-gray-300">
            {navLinks.map((link) => {
              if (link.protected && !user) return null;
              return (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:text-green-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Contact</h2>
          <p className="text-gray-300 flex items-center space-x-2 mb-2">
            <FaEnvelope className="text-gray-300" />
            <a
              href="mailto:web@programming-hero.com"
              className="hover:text-green-400 transition-colors"
            >
              web@programming-hero.com
            </a>
          </p>
          <p className="text-gray-300 flex items-center space-x-2">
            <FaMapMarkerAlt className="text-gray-300" />
            <span>Dhaka, Bangladesh</span>
          </p>
        </div>
      </div>

      <div className="bg-[#356A6A] mt-10 py-3 text-center text-sm text-gray-200">
        Copyright © {new Date().getFullYear()}{" "}
        <span className="font-semibold">FinEase</span>. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
