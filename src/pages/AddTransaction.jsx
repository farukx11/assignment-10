import React, { useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const AddTransaction = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please login first!",
        background: "#fff",
        showConfirmButton: true,
        confirmButtonColor: "#4F46E5",
      });
    }

    if (!title || !amount || !category || !date) {
      return Swal.fire({
        icon: "warning",
        title: "Incomplete Fields",
        text: "Please fill all required fields.",
        background: "#fff",
        showConfirmButton: true,
        confirmButtonColor: "#F59E0B",
      });
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "transactions"), {
        userId: user.uid,
        userEmail: user.email,
        name: user.displayName || "Anonymous",
        title: title.trim(),
        amount: parseFloat(amount),
        type,
        category: category.trim(),
        description: description.trim() || "",
        date: Timestamp.fromDate(date),
        createdAt: serverTimestamp(),
      });

      Swal.fire({
        icon: "success",
        title: "Transaction Added!",
        text: "Your transaction has been added successfully.",
        background: "#fff",
        showConfirmButton: true,
        confirmButtonColor: "#22C55E",
      });

      setTitle("");
      setAmount("");
      setType("income");
      setCategory("");
      setDescription("");
      setDate(null);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.message,
        background: "#fff",
        showConfirmButton: true,
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Add Transaction
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
          min="0.01"
          step="0.01"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <DatePicker
          selected={date}
          onChange={setDate}
          dateFormat="dd-MM-yyyy"
          placeholderText="Select date"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-md text-white ${
            loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Adding..." : "Add Transaction"}
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;
