import React from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, logout, loading } = useAuth();

  // Show loading state while fetching user data
  if (loading) return <p className="text-center mt-10">Loading user info...</p>;

  // If no user is logged in, display a message
  if (!user)
    return (
      <p className="text-center mt-10">Please log in to view your profile.</p>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>

        {/* Profile Image */}
        <div className="mb-4">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-24 h-24 mx-auto rounded-full"
            />
          ) : (
            <div className="w-24 h-24 mx-auto rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xl text-white">
                {user.displayName.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* User Info */}
        <p className="text-lg font-medium">Name: {user.displayName || "N/A"}</p>
        <p className="text-lg font-medium">Email: {user.email || "N/A"}</p>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="mt-6 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
