import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to from-gray-100 to-blue-100 text-center px-4">
      {/* 404 Number */}
      <h1 className="text-[8rem] md:text-[10rem] font-extrabold text-blue-600 drop-shadow-lg animate-bounce">
        404
      </h1>

      {/* Message */}
      <p className="text-lg md:text-2xl text-gray-700 mb-8 animate-fadeIn opacity-0">
        Oops! The page you are looking for doesn’t exist or has been moved.
      </p>

      {/* Go Home Button */}
      <Link
        to="/"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 hover:scale-105 transition-transform duration-300 shadow-md"
      >
        Go Back Home
      </Link>

      {/* Animation Styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 1s ease forwards;
          }
        `}
      </style>
    </div>
  );
};

export default NotFound;
