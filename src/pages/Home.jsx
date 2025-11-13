import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Loader from "../components/Loader";
import Swal from "sweetalert2";
import bannerCircle from "../assets/circle.png";
import "../app.css";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [overview, setOverview] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (user?.email) {
      fetchOverview();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/transactions/overview?email=${
          user.email
        }`
      );
      if (res.data) {
        setOverview(res.data);
      } else {
        Swal.fire("No Data", "No financial data found", "info");
      }
    } catch (err) {
      Swal.fire("Error", "Failed to load financial overview", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  if (loading) return <Loader />;

  return (
    <div
      className={`${
        darkMode ? "bg-[#0F172A] text-[#E2E8F0]" : "bg-[#F8FAFC] text-[#1E293B]"
      } min-h-screen relative`}
    >
      {/* ---------- Dark/Light Toggle Icon ---------- */}
      <div className="fixed top-24 right-6 z-50">
        <button
          onClick={toggleDarkMode}
          className="p-1 rounded-full bg-black text-white shadow-lg hover:bg-gray-700 transition"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m8.66-12.66l-.707.707M4.05 19.95l-.707.707M21 12h-1M4 12H3m16.66 4.66l-.707-.707M4.05 4.05l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* ---------- Banner Section ---------- */}
      <section className="relative py-40">
        <div className="container mx-auto px-6 flex flex-col-reverse md:flex-row items-center justify-between gap-8">
          {/* Text on Left */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Take Control of Your Finances with{" "}
              <span className="text-[#3B82F6]">FinEase</span>
            </h1>
            <p className="text-lg mb-6">
              Track your income, expenses, and savings effortlessly — build a
              better financial future.
            </p>
            {!user ? (
              <Link
                to="/register"
                className="px-6 py-3 bg-[#3B82F6] text-white font-semibold rounded-md hover:bg-[#2563EB] transition-colors"
              >
                Get Started
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-[#3B82F6] text-white font-semibold rounded-md hover:bg-[#2563EB] transition"
              >
                Go to Dashboard
              </Link>
            )}
          </div>

          {/* Rotating Image on Right */}
          <div className="md:w-1/2 flex justify-center md:justify-end mb-8 md:mb-0">
            <img
              src={bannerCircle}
              alt="Rotating Circle"
              className="w-64 h-64 md:w-80 md:h-80 animate-spin-slow transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* ---------- Financial Overview Section (Gradient Background with Hex Codes) ---------- */}
      <section
        className={`relative py-40 text-center ${
          darkMode
            ? "bg-[linear-gradient(135deg,#0F172A,#1E293B,#334155)]"
            : "bg-[linear-gradient(135deg,#DBEAFE,#EFF6FF,#DBEAFE)]"
        }`}
      >
        <div className="container mx-auto px-6">
          <h2
            className={`text-3xl font-bold mb-10 ${
              darkMode ? "text-[#E2E8F0]" : "text-[#1E293B]"
            }`}
          >
            Your Financial Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Income Card */}
            <div
              className={`shadow-md rounded-lg p-6 ${
                darkMode ? "bg-[#1E293B]/80" : "bg-[#FFFFFF]/90"
              }`}
            >
              <h3 className="text-xl font-semibold mb-2 text-[#22C55E]">
                Total Income
              </h3>
              <p className="text-3xl font-bold mt-2">${overview.income}</p>
            </div>

            {/* Expense Card */}
            <div
              className={`shadow-md rounded-lg p-6 ${
                darkMode ? "bg-[#1E293B]/80" : "bg-[#FFFFFF]/90"
              }`}
            >
              <h3 className="text-xl font-semibold mb-2 text-[#EF4444]">
                Total Expense
              </h3>
              <p className="text-3xl font-bold mt-2">${overview.expense}</p>
            </div>

            {/* Balance Card */}
            <div
              className={`shadow-md rounded-lg p-6 ${
                darkMode ? "bg-[#1E293B]/80" : "bg-[#FFFFFF]/90"
              }`}
            >
              <h3 className="text-xl font-semibold mb-2 text-[#3B82F6]">
                Balance
              </h3>
              <p className="text-3xl font-bold mt-2">${overview.balance}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Budgeting Tips Section ---------- */}
      <section
        className={`${
          darkMode
            ? "bg-[#1E293B] text-[#E2E8F0]"
            : "bg-[#F1F5F9] text-[#1E293B]"
        } py-40`}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Budgeting Tips
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div
              className={`p-6 rounded-lg shadow hover:shadow-lg transition ${
                darkMode ? "bg-[#334155]" : "bg-[#FFFFFF]"
              }`}
            >
              <h3 className="text-xl font-semibold mb-2 text-[#3B82F6]">
                Track Every Expense
              </h3>
              <p>
                Record each transaction, no matter how small, to understand your
                spending pattern.
              </p>
            </div>
            <div
              className={`p-6 rounded-lg shadow hover:shadow-lg transition ${
                darkMode ? "bg-[#334155]" : "bg-[#FFFFFF]"
              }`}
            >
              <h3 className="text-xl font-semibold mb-2 text-[#3B82F6]">
                Set Monthly Budgets
              </h3>
              <p>
                Create a realistic monthly budget for essential categories like
                food, rent, and travel.
              </p>
            </div>
            <div
              className={`p-6 rounded-lg shadow hover:shadow-lg transition ${
                darkMode ? "bg-[#334155]" : "bg-[#FFFFFF]"
              }`}
            >
              <h3 className="text-xl font-semibold mb-2 text-[#3B82F6]">
                Save Before You Spend
              </h3>
              <p>
                Treat savings as a non-negotiable expense — pay yourself first
                before spending.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Why Financial Planning Matters ---------- */}
      <section className="container mx-auto px-6 py-40 text-center">
        <h2
          className={`text-3xl font-bold mb-6 ${
            darkMode ? "text-[#E2E8F0]" : "text-[#1E293B]"
          }`}
        >
          Why Financial Planning Matters
        </h2>
        <p
          className={`max-w-3xl mx-auto leading-relaxed ${
            darkMode ? "text-[#CBD5E1]" : "text-[#475569]"
          }`}
        >
          Financial planning helps you make the most out of your money by
          organizing your income, expenses, and savings goals. It gives you a
          clear roadmap to achieve long-term security and peace of mind. With
          FinEase, managing money becomes smarter, easier, and stress-free.
        </p>
        <Link
          to="/add-transaction"
          className="inline-block mt-8 px-6 py-3 bg-[#3B82F6] text-white font-semibold rounded-md hover:bg-[#2563EB] transition"
        >
          Start Managing Now
        </Link>
      </section>
    </div>
  );
};

export default Home;
