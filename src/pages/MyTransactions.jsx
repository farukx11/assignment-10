import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase.config";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MyTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("dateDesc");

  const MySwal = withReactContent(Swal);

  // Fetch Transactions
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
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch transactions",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [user]);

  // Delete Transaction
  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "transactions", id));
        setTransactions(transactions.filter((tx) => tx.id !== id));
        MySwal.fire("Deleted!", "Transaction has been deleted.", "success");
      } catch (error) {
        console.error(error);
        MySwal.fire("Error", "Failed to delete transaction", "error");
      }
    }
  };

  // Sort Function
  const handleSort = (option) => {
    let sorted = [...transactions];
    switch (option) {
      case "dateAsc":
        sorted.sort((a, b) => a.date.seconds - b.date.seconds);
        break;
      case "dateDesc":
        sorted.sort((a, b) => b.date.seconds - a.date.seconds);
        break;
      case "amountAsc":
        sorted.sort((a, b) => a.amount - b.amount);
        break;
      case "amountDesc":
        sorted.sort((a, b) => b.amount - a.amount);
        break;
      default:
        break;
    }
    setSortBy(option);
    setTransactions(sorted);
  };

  // Modal Update
  const handleUpdateModal = async (tx) => {
    const { value: formValues } = await MySwal.fire({
      title: "Update Transaction",
      html:
        `<input id="swal-title" class="swal2-input" placeholder="Title" value="${tx.title}">` +
        `<input id="swal-amount" type="number" class="swal2-input" placeholder="Amount" value="${tx.amount}">` +
        `<input id="swal-category" class="swal2-input" placeholder="Category" value="${tx.category}">`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          title: document.getElementById("swal-title").value,
          amount: parseFloat(document.getElementById("swal-amount").value),
          category: document.getElementById("swal-category").value,
        };
      },
    });

    if (formValues) {
      try {
        await updateDoc(doc(db, "transactions", tx.id), formValues);
        // Update locally
        setTransactions((prev) =>
          prev.map((t) => (t.id === tx.id ? { ...t, ...formValues } : t))
        );
        MySwal.fire("Updated!", "Transaction has been updated.", "success");
      } catch (error) {
        console.error(error);
        MySwal.fire("Error", "Failed to update transaction", "error");
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    );

  if (!transactions.length)
    return (
      <p className="text-center mt-8 text-gray-500">No transactions found.</p>
    );

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <h2 className="text-3xl font-bold mb-6 text-center md:text-left">
        My Transactions
      </h2>

      {/* Sort Options */}
      <div className="mb-6 flex flex-wrap gap-3 justify-center md:justify-start">
        <button
          onClick={() => handleSort("dateDesc")}
          className={`px-4 py-2 rounded cursor-pointer border transition ${
            sortBy === "dateDesc"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-gray-200 border-gray-300"
          }`}
        >
          Newest
        </button>
        <button
          onClick={() => handleSort("dateAsc")}
          className={`px-4 py-2 rounded cursor-pointer border transition ${
            sortBy === "dateAsc"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-gray-200 border-gray-300"
          }`}
        >
          Oldest
        </button>
        <button
          onClick={() => handleSort("amountAsc")}
          className={`px-4 py-2 rounded cursor-pointer border transition ${
            sortBy === "amountAsc"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-gray-200 border-gray-300"
          }`}
        >
          Amount Low-High
        </button>
        <button
          onClick={() => handleSort("amountDesc")}
          className={`px-4 py-2 rounded cursor-pointer border transition ${
            sortBy === "amountDesc"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-gray-200 border-gray-300"
          }`}
        >
          Amount High-Low
        </button>
      </div>

      {/* Transaction List */}
      <ul className="space-y-4">
        {transactions.map((tx) => (
          <li
            key={tx.id}
            className="border p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center shadow hover:shadow-lg transition"
          >
            <div className="flex flex-col md:flex-row md:items-center md:gap-4 w-full md:w-2/3">
              <p className="font-semibold text-lg">{tx.title}</p>
              <p className="text-sm text-gray-500 mt-1 md:mt-0">
                {tx.category} |{" "}
                {new Date(tx.date.seconds * 1000).toLocaleDateString()} |
                Amount: ${tx.amount}
              </p>
            </div>
            <div className="mt-3 md:mt-0 flex gap-2 flex-wrap">
              <button
                onClick={() => handleUpdateModal(tx)}
                className="px-3 py-1 bg-blue-400 text-white rounded hover:bg-blue-500 transition cursor-pointer"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(tx.id)}
                className="px-3 py-1 bg-red-400 text-white rounded hover:bg-red-500 transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyTransactions;
