import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const Profile = () => {
  const { user, updateUserProfile, logout, loading } = useAuth();

  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [isUpdating, setIsUpdating] = useState(false);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );

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
    <div className="flex justify-center px-4 py-10  bg-gray-100">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left text-gray-800">
          My Profile
        </h2>

        {/* Profile Photo */}
        <div className="text-center mb-4">
          <img
            src={user.photoURL || "https://via.placeholder.com/100"}
            alt="profile"
            className="w-24 h-24 mx-auto rounded-full border border-gray-300 shadow-sm"
          />
        </div>

        {/* Update Form */}
        <form onSubmit={handleUpdate} className="space-y-3">
          <div>
            <label className="font-semibold block mb-1">Name:</label>
            <input
              type="text"
              value={name}
              className="w-full p-2 border rounded focus:outline-blue-400"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Photo URL:</label>
            <input
              type="text"
              value={photoURL}
              className="w-full p-2 border rounded focus:outline-blue-400"
              onChange={(e) => setPhotoURL(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Email:</label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full p-2 border bg-gray-200 rounded cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-3 mt-4">
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 bg-blue-400 text-white py-2 rounded cursor-pointer hover:bg-blue-500 transition-colors font-semibold"
            >
              {isUpdating ? "Updating..." : "Update Profile"}
            </button>

            <button
              type="button"
              onClick={logout}
              className="flex-1 bg-red-400 text-white py-2 rounded cursor-pointer hover:bg-red-500 transition-colors font-semibold"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
