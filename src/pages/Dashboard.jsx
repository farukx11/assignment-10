import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, query, where, onSnapshot } from "firebase/firestore";
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

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
  });
  const [chartData, setChartData] = useState([]);

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

      snapshot.forEach((doc) => {
        const data = doc.data();
        const txAmount = parseFloat(data.amount || 0);
        if (data.type === "income") income += txAmount;
        if (data.type === "expense") expense += txAmount;

        tempChartData.push({
          name: data.title,
          Income: data.type === "income" ? txAmount : 0,
          Expense: data.type === "expense" ? txAmount : 0,
        });
      });

      setSummary({
        totalBalance: income - expense,
        totalIncome: income,
        totalExpenses: expense,
      });
      setChartData(tempChartData);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <div
        className="text-white rounded-lg p-6 mb-6 shadow-lg text-center"
        style={{
          backgroundImage: "linear-gradient(to right, #3B82F6, #6366F1)",
        }}
      >
        <h2 className="text-3xl font-bold mb-2">
          Welcome, {user?.displayName || "User"}!
        </h2>
        <p className="text-lg">
          Track your finances and achieve your financial goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Balance</h3>
          <p className="text-2xl font-bold text-green-600">
            ${summary.totalBalance.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Income</h3>
          <p className="text-2xl font-bold text-blue-600">
            ${summary.totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">
            ${summary.totalExpenses.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Income vs Expenses</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Income" stroke="#3B82F6" />
              <Line type="monotone" dataKey="Expense" stroke="#EF4444" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">No transactions yet</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
