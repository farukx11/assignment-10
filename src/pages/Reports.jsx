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
      <div className="text-center mt-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const incomeToShow = isNaN(income) ? 0 : income;
  const expenseToShow = isNaN(expense) ? 0 : expense;
  const balance = incomeToShow - expenseToShow;

  return (
    <div className="flex justify-center mt-20 px-4">
      <div
        className="w-full max-w-md bg-white rounded-lg shadow-xl p-6"
        style={{ border: "1px solid #e2e8f0" }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Reports
        </h2>

        <table className="w-full text-center divide-y divide-gray-200">
          <tbody>
            <tr>
              <td className="py-3 font-semibold text-green-600">
                Total Income
              </td>
              <td className="py-3 font-bold text-green-600">
                ${incomeToShow.toFixed(2)}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="py-3 font-semibold text-red-600">Total Expense</td>
              <td className="py-3 font-bold text-red-600">
                ${expenseToShow.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="py-3 font-semibold text-blue-600">Balance</td>
              <td className="py-3 font-bold text-blue-600">
                ${balance.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
