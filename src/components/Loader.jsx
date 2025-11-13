import React from "react";

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 dark:border-yellow-400"></div>
      <p className="mt-4 text-gray-700 dark:text-gray-200 font-medium">
        {message}
      </p>
    </div>
  );
};

export default Loader;
