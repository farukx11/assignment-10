import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase.config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const Reports = () => {
  const { user } = useAuth();
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let inc = 0,
          exp = 0;

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.type === "income" && !isNaN(data.amount)) {
            inc += Number(data.amount);
          } else if (data.type === "expense" && !isNaN(data.amount)) {
            exp += Number(data.amount);
          }
        });

        setIncome(inc);
        setExpense(exp);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching transactions:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  const incomeToShow = isNaN(income) ? 0 : income;
  const expenseToShow = isNaN(expense) ? 0 : expense;
  const balance = incomeToShow - expenseToShow;

  return (
    <div className="flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 md:p-10">
        <h2 className="text-3xl font-bold mb-8 text-center md:text-left text-gray-800">
          Reports
        </h2>

        {/* Cards for Income, Expense, Balance */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 rounded-lg p-5 flex flex-col items-center shadow hover:shadow-md transition">
            <p className="text-lg font-semibold text-green-600">Income</p>
            <p className="text-2xl font-bold text-green-700 mt-2">
              ${incomeToShow.toFixed(2)}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-5 flex flex-col items-center shadow hover:shadow-md transition">
            <p className="text-lg font-semibold text-red-600">Expense</p>
            <p className="text-2xl font-bold text-red-700 mt-2">
              ${expenseToShow.toFixed(2)}
            </p>
          </div>
          <div
            className={`rounded-lg p-5 flex flex-col items-center shadow hover:shadow-md transition ${
              balance >= 0 ? "bg-blue-50" : "bg-yellow-50"
            }`}
          >
            <p className="text-lg font-semibold text-blue-600">Balance</p>
            <p
              className={`text-2xl font-bold mt-2 ${
                balance >= 0 ? "text-blue-700" : "text-yellow-700"
              }`}
            >
              ${balance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 border-b text-left text-gray-700">
                  Type
                </th>
                <th className="py-3 px-4 border-b text-right text-gray-700">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50 transition">
                <td className="py-3 px-4 border-b text-green-600 font-semibold">
                  Total Income
                </td>
                <td className="py-3 px-4 border-b text-right text-green-700 font-bold">
                  ${incomeToShow.toFixed(2)}
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="py-3 px-4 border-b text-red-600 font-semibold">
                  Total Expense
                </td>
                <td className="py-3 px-4 border-b text-right text-red-700 font-bold">
                  ${expenseToShow.toFixed(2)}
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="py-3 px-4 border-b text-blue-600 font-semibold">
                  Balance
                </td>
                <td className="py-3 px-4 border-b text-right text-blue-700 font-bold">
                  ${balance.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
