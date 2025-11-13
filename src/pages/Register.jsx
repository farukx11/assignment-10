import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Register = () => {
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { registerUser, googleLogin } = useAuth();
  const navigate = useNavigate();

  // Password validation function
  const validatePassword = (password) => {
    // Minimum 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      Swal.fire({
        icon: "error",
        title: "Weak Password",
        text: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
      });
      return;
    }

    setLoading(true);
    try {
      await registerUser(name, email, password, photoURL);
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/dashboard");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          err.code === "auth/email-already-in-use"
            ? "Email is already in use. Please login or use another email."
            : "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await googleLogin();
      Swal.fire({
        icon: "success",
        title: "Google Registration Successful!",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/dashboard");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Google Registration Failed",
        text: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
          Register at FinEase
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Photo URL (optional)"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password input with toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white font-semibold transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`mt-4 w-full py-2 rounded text-white font-semibold transition ${
            loading
              ? "bg-red-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {loading ? "Please wait..." : "Register with Google"}
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
