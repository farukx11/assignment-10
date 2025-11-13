import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase.config";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const MyTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const q = query(
          collection(db, "transactions"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTransactions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [user]);

  if (loading) return <p className="text-center mt-4">Loading...</p>;

  if (!transactions.length)
    return <p className="text-center mt-4">No transactions found.</p>;

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h2 className="text-2xl font-bold mb-4">My Transactions</h2>
      <ul>
        {transactions.map((tx) => (
          <li
            key={tx.id}
            className="border p-4 mb-2 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{tx.title}</p>
              <p className="text-sm text-gray-500">
                {tx.category} |{" "}
                {new Date(tx.date.seconds * 1000).toLocaleDateString()}
              </p>
            </div>
            <Link
              to={`/transaction/${tx.id}`}
              className="text-blue-600 underline"
            >
              Details
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyTransactions;
