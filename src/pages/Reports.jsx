// src/pages/Reports.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase.config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const Reports = () => {
  const { user } = useAuth();
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "transactions"),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        let inc = 0,
          exp = 0;
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.type === "income") inc += data.amount;
          else if (data.type === "expense") exp += data.amount;
        });
        setIncome(inc);
        setExpense(exp);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTransactions();
  }, [user]);

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Reports</h2>
      <p>
        <strong>Total Income:</strong> ${income.toFixed(2)}
      </p>
      <p>
        <strong>Total Expense:</strong> ${expense.toFixed(2)}
      </p>
      <p>
        <strong>Balance:</strong> ${(income - expense).toFixed(2)}
      </p>
    </div>
  );
};

export default Reports;
