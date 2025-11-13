// src/pages/UpdateTransaction.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { toast } from "react-toastify";

const UpdateTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const docRef = doc(db, "transactions", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setAmount(data.amount);
          setType(data.type);
          setCategory(data.category);
          setDescription(data.description);
          setDate(
            new Date(data.date.seconds * 1000).toISOString().split("T")[0]
          );
        } else {
          toast.error("Transaction not found!");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDoc(doc(db, "transactions", id), {
        title,
        amount: parseFloat(amount),
        type,
        category,
        description,
        date: new Date(date),
      });
      toast.success("Transaction updated!");
      navigate(`/transaction/${id}`);
    } catch (error) {
      console.error(error);
      toast.error("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Update Transaction</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Updating..." : "Update Transaction"}
        </button>
      </form>
    </div>
  );
};

export default UpdateTransaction;
