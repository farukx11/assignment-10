import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransaction";
import MyTransactions from "./pages/MyTransactions";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports"; // Reports import
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import UpdateTransaction from "./pages/UpdateTransaction";
import TransactionDetails from "./pages/TransactionDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const location = useLocation();

  // Navbar/Footer দেখানো হবে কেবল নির্দিষ্ট পেজে
  const hideLayout =
    location.pathname !== "/" &&
    location.pathname !== "/login" &&
    location.pathname !== "/register" &&
    location.pathname !== "/dashboard" &&
    location.pathname !== "/add-transaction" &&
    location.pathname !== "/profile" &&
    location.pathname !== "/my-transactions" &&
    location.pathname !== "/reports" && // Reports রুট এখানে যোগ করা হলো
    !location.pathname.startsWith("/transaction");

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {!hideLayout && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-transaction"
            element={
              <PrivateRoute>
                <AddTransaction />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-transactions"
            element={
              <PrivateRoute>
                <MyTransactions />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            }
          />
          <Route
            path="/update-transaction/:id"
            element={
              <PrivateRoute>
                <UpdateTransaction />
              </PrivateRoute>
            }
          />
          <Route
            path="/transaction/:id"
            element={
              <PrivateRoute>
                <TransactionDetails />
              </PrivateRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;
