import React, { useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
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
    if (!user) return toast.error("Please login first!");
    if (!title || !amount || !category || !date)
      return toast.error("Please fill all required fields correctly.");

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

      // ✅ Show toast first
      toast.success("Transaction added successfully!");

      // Reset form
      setTitle("");
      setAmount("");
      setType("income");
      setCategory("");
      setDescription("");
      setDate(null);

      // Redirect after short delay (toast visible)
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      console.error(error);
      toast.error("Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Add Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          className="w-full p-2 border rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="0.01"
          step="0.01"
        />
        <select
          className="w-full p-2 border rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="text"
          placeholder="Category"
          className="w-full p-2 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <textarea
          placeholder="Description (optional)"
          className="w-full p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <DatePicker
          selected={date}
          onChange={setDate}
          dateFormat="dd-MM-yyyy"
          placeholderText="Select date (DD-MM-YYYY)"
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className={`w-full py-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Transaction"}
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;
