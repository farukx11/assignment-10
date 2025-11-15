import React, { createContext, useState, useEffect, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  updateProfile as firebaseUpdateProfile,
} from "firebase/auth";
import Swal from "sweetalert2";
import { auth, googleProvider } from "../firebase/firebase.config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      setLoading(false);

      if (currentUser) {
        localStorage.setItem("token", currentUser.accessToken);
      } else {
        localStorage.removeItem("token");
      }
    });

    return () => unsubscribe();
  }, []);

  // Register User
  const registerUser = async (name, email, password, photoURL) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await firebaseUpdateProfile(result.user, {
        displayName: name,
        photoURL: photoURL || null,
      });
      setUser({ ...result.user });

      localStorage.setItem("token", result.user.accessToken);

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        showConfirmButton: false,
        timer: 1500,
      });

      return result.user;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed!",
        text: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login User
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser({ ...result.user });
      localStorage.setItem("token", result.user.accessToken);

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        showConfirmButton: false,
        timer: 1500,
      });

      return result.user;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed!",
        text: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const googleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      localStorage.setItem("token", result.user.accessToken);

      Swal.fire({
        icon: "success",
        title: "Google Login Successful!",
        showConfirmButton: false,
        timer: 1500,
      });

      return result.user;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Google Login Failed!",
        text: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("token");

      Swal.fire({
        icon: "success",
        title: "Logout Successful!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Logout Failed!",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Update User Profile
  const updateUserProfile = async (updatedData) => {
    if (!auth.currentUser) {
      Swal.fire({
        icon: "error",
        title: "No user logged in!",
      });
      return null;
    }
    setLoading(true);
    try {
      await firebaseUpdateProfile(auth.currentUser, updatedData);
      // Update local user state
      setUser({ ...auth.currentUser });
      Swal.fire({
        icon: "success",
        title: "Profile Updated Successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
      return auth.currentUser;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Profile Update Failed!",
        text: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const authInfo = {
    user,
    loading,
    registerUser,
    loginUser,
    googleLogin,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { AuthContext };
