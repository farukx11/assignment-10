import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase.config";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

const Dashboard = () => {
  const { user } = useAuth();

  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [editTransaction, setEditTransaction] = useState(null);

  const [monthFilter, setMonthFilter] = useState("all");

  // --------------------- FETCH DATA ---------------------
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let income = 0;
      let expense = 0;

      const tempChartData = [];
      const tempTransactions = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const amount = parseFloat(data.amount || 0);

        const dateObj = data.date?.toDate
          ? data.date.toDate()
          : new Date(data.date);
        const month = dateObj.getMonth() + 1;

        if (data.type === "income") income += amount;
        if (data.type === "expense") expense += amount;

        tempChartData.push({
          name: data.title,
          month,
          Income: data.type === "income" ? amount : 0,
          Expense: data.type === "expense" ? amount : 0,
        });

        tempTransactions.push({ id: docSnap.id, month, ...data });
      });

      setSummary({
        totalBalance: income - expense,
        totalIncome: income,
        totalExpenses: expense,
      });

      setChartData(tempChartData);
      setTransactions(tempTransactions);
    });

    return () => unsubscribe();
  }, [user]);

  // ---------------------- FILTER HANDLER ----------------------
  const filteredTransactions =
    monthFilter === "all"
      ? transactions
      : transactions.filter((tx) => tx.month === Number(monthFilter));

  const filteredChart =
    monthFilter === "all"
      ? chartData
      : chartData.filter((tx) => tx.month === Number(monthFilter));

  // ------------------- DELETE TRANSACTION -------------------
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Transaction?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      background: "#FFFFFF",
      width: "360px",
      confirmButtonColor: "#EF4444",
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, "transactions", id));

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Transaction removed successfully.",
        background: "#FFFFFF",
        width: "360px",
      });
    }
  };

  // ------------------- UPDATE TRANSACTION -------------------
  const handleUpdate = async () => {
    if (!editTransaction.title || !editTransaction.amount) {
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Title and Amount are required.",
        background: "#FFFFFF",
        width: "360px",
      });
      return;
    }

    await updateDoc(
      doc(db, "transactions", editTransaction.id),
      editTransaction
    );

    Swal.fire({
      icon: "success",
      title: "Updated",
      text: "Transaction updated successfully.",
      background: "#FFFFFF",
      width: "360px",
    });

    setEditTransaction(null);
  };

  // ------------------- DATE HANDLER -------------------
  const formatDate = (date) => {
    if (!date) return "N/A";
    if (date.toDate) return date.toDate().toLocaleDateString();
    return new Date(date).toLocaleDateString();
  };

  return (
    <div
      className="min-h-screen flex justify-center"
      style={{ backgroundColor: "#F4F7FF" }}
    >
      <div className="w-full max-w-6xl p-4 md:p-6">
        {/* ------------------- HEADER / WELCOME ------------------- */}
        <div
          className="rounded-xl flex flex-col justify-center items-center mb-10"
          style={{
            minHeight: "160px",
            padding: "2rem",
            color: "#FFFFFF",
            background: "linear-gradient(90deg, #4F46E5, #6366F1)",
            boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
            backdropFilter: "blur(10px)",
            textAlign: "center",
          }}
        >
          <h2 className="text-3xl font-bold tracking-wide">
            Welcome, {user?.displayName || "User"}
          </h2>
          <p className="text-lg opacity-90 mt-2">
            Manage your finances smarter with FinEase Dashboard
          </p>
        </div>

        {/* ------------------- SUMMARY CARDS ------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              title: "Total Balance",
              amount: summary.totalBalance.toFixed(2),
              color: "text-indigo-600",
            },
            {
              title: "Total Income",
              amount: summary.totalIncome.toFixed(2),
              color: "text-blue-500",
            },
            {
              title: "Total Expenses",
              amount: summary.totalExpenses.toFixed(2),
              color: "text-red-500",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="p-8 rounded-xl shadow-xl transform hover:-translate-y-1 transition-all flex flex-col justify-center items-center"
              style={{
                backgroundColor: "#FFFFFF",
                minHeight: "160px",
                boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
              }}
            >
              <h3 className="text-lg font-bold text-gray-700 text-center">
                {card.title}
              </h3>
              <p
                className={`text-3xl mt-4 font-bold ${card.color} text-center`}
              >
                ${card.amount}
              </p>
            </div>
          ))}
        </div>

        {/* ------------------- MONTH FILTER ------------------- */}
        <div className="flex justify-center mb-10 mt-4">
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="p-2 border rounded bg-white shadow"
          >
            <option value="all">All Months</option>
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        {/* ------------------- CHART SECTION ------------------- */}
        <div
          className="p-6 rounded-xl shadow-xl mb-10"
          style={{
            backgroundColor: "#EFF6FF",
            border: "1px solid #DBEAFE",
          }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: "#4F46E5" }}>
            Income vs Expenses
          </h3>

          {filteredChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredChart}>
                <CartesianGrid stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="Income"
                  stroke="#3B82F6"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="Expense"
                  stroke="#EF4444"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 text-center">No data available</p>
          )}
        </div>

        {/* ------------------- TRANSACTIONS TABLE ------------------- */}
        <div
          className="p-6 rounded-xl shadow-xl mb-10"
          style={{
            backgroundColor: "#FDF2F8",
            border: "1px solid #FBCFE8",
          }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: "#DB2777" }}>
            My Transactions
          </h3>

          {filteredTransactions.length === 0 ? (
            <p className="text-center text-gray-700">No transactions found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead
                  style={{
                    backgroundColor: "#FFFFFFAA",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <tr className="border-b" style={{ borderColor: "#E5E7EB" }}>
                    <th className="p-3 text-gray-700 text-center">Title</th>
                    <th className="p-3 text-gray-700 text-center">Type</th>
                    <th className="p-3 text-gray-700 text-center">Category</th>
                    <th className="p-3 text-gray-700 text-center">Amount</th>
                    <th className="p-3 text-gray-700 text-center">Date</th>
                    <th className="p-3 text-gray-700 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b hover:bg-white/70 transition cursor-pointer"
                      style={{ borderColor: "#E5E7EB" }}
                    >
                      <td className="p-3 text-center">{tx.title}</td>
                      <td className="p-3 text-center capitalize">{tx.type}</td>
                      <td className="p-3 text-center">{tx.category}</td>
                      <td className="p-3 text-center font-semibold">
                        ${tx.amount}
                      </td>
                      <td className="p-3 text-center">{formatDate(tx.date)}</td>

                      <td className="p-3 flex justify-center gap-3">
                        <button
                          onClick={() => setEditTransaction(tx)}
                          style={{ color: "#3B82F6" }}
                          className="hover:text-blue-800 transition"
                        >
                          ✏️
                        </button>

                        <button
                          onClick={() => handleDelete(tx.id)}
                          style={{ color: "#EF4444" }}
                          className="hover:text-red-800 transition"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ------------------- EDIT MODAL ------------------- */}
        {editTransaction && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{
              backgroundColor: "#00000066",
              backdropFilter: "blur(4px)",
            }}
          >
            <div
              className="rounded-xl p-6 w-11/12 max-w-md shadow-xl"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: "#4F46E5" }}
              >
                Edit Transaction
              </h3>

              <input
                type="text"
                value={editTransaction.title}
                onChange={(e) =>
                  setEditTransaction({
                    ...editTransaction,
                    title: e.target.value,
                  })
                }
                className="w-full p-3 mb-3 border rounded"
              />

              <input
                type="number"
                value={editTransaction.amount}
                onChange={(e) =>
                  setEditTransaction({
                    ...editTransaction,
                    amount: e.target.value,
                  })
                }
                className="w-full p-3 mb-3 border rounded"
              />

              <select
                value={editTransaction.type}
                onChange={(e) =>
                  setEditTransaction({
                    ...editTransaction,
                    type: e.target.value,
                  })
                }
                className="w-full p-3 mb-3 border rounded"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              <input
                type="text"
                value={editTransaction.category}
                onChange={(e) =>
                  setEditTransaction({
                    ...editTransaction,
                    category: e.target.value,
                  })
                }
                className="w-full p-3 mb-3 border rounded"
              />

              <textarea
                value={editTransaction.description}
                onChange={(e) =>
                  setEditTransaction({
                    ...editTransaction,
                    description: e.target.value,
                  })
                }
                className="w-full p-3 mb-3 border rounded"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditTransaction(null)}
                  className="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  className="px-5 py-2 text-white rounded hover:bg-indigo-700 transition"
                  style={{ backgroundColor: "#4F46E5" }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
