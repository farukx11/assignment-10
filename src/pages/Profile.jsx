import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const Profile = () => {
  const { user, updateUserProfile, logout, loading } = useAuth();

  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [isUpdating, setIsUpdating] = useState(false);

  if (loading) return <p className="text-center mt-10">Loading user info...</p>;

  if (!user) return <p className="text-center mt-10">Please log in first.</p>;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await updateUserProfile({
        displayName: name,
        photoURL: photoURL,
      });

      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        toast: true,
        position: "top-right",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed!",
        text: error.message,
      });
    }

    setIsUpdating(false);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4 pt-10">
      {/* Form Card */}
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
        <h2 className="text-2xl font-bold text-center mb-5">My Profile</h2>

        {/* Current Profile Photo */}
        <div className="text-center mb-4">
          <img
            src={user.photoURL || "https://via.placeholder.com/80"}
            alt="profile"
            className="w-24 h-24 mx-auto rounded-full border border-gray-300 shadow-sm"
          />
        </div>

        {/* Update Form */}
        <form onSubmit={handleUpdate}>
          <label className="font-semibold block mb-1">Name:</label>
          <input
            type="text"
            value={name}
            className="w-full p-2 border rounded mb-3 cursor-text focus:outline-blue-400"
            onChange={(e) => setName(e.target.value)}
          />

          <label className="font-semibold block mb-1">Photo URL:</label>
          <input
            type="text"
            value={photoURL}
            className="w-full p-2 border rounded mb-3 cursor-text focus:outline-blue-400"
            onChange={(e) => setPhotoURL(e.target.value)}
          />

          <label className="font-semibold block mb-1">Email:</label>
          <input
            type="email"
            value={user.email}
            readOnly
            className="w-full p-2 border bg-gray-200 rounded mb-3 cursor-not-allowed"
          />

          {/* Update Profile Button */}
          <button
            type="submit"
            disabled={isUpdating}
            className={`block mx-auto w-32 bg-blue-400 text-white py-2 rounded mt-2 hover:bg-blue-500 transition-colors cursor-pointer`}
          >
            {isUpdating ? "Updating..." : "Update Profile"}
          </button>
        </form>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="block mx-auto w-32 bg-red-400 text-white py-2 rounded mt-4 hover:bg-red-500 transition-colors cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
