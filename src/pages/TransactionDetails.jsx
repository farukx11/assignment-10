import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { toast } from "react-toastify";

const TransactionDetails = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const docRef = doc(db, "transactions", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTransaction({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error("Transaction not found!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch transaction!");
      }
    };
    fetchTransaction();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;
    try {
      await deleteDoc(doc(db, "transactions", id));
      toast.success("Transaction deleted!");
      navigate("/my-transactions");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete transaction!");
    }
  };

  if (!transaction) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>
      <p>
        <strong>Title:</strong> {transaction.title}
      </p>
      <p>
        <strong>Amount:</strong> {transaction.amount}
      </p>
      <p>
        <strong>Type:</strong> {transaction.type}
      </p>
      <p>
        <strong>Category:</strong> {transaction.category}
      </p>
      <p>
        <strong>Description:</strong> {transaction.description || "-"}
      </p>
      <p>
        <strong>Date:</strong>{" "}
        {new Date(transaction.date.seconds * 1000).toLocaleDateString()}
      </p>
      <div className="flex gap-2 mt-4">
        <Link
          to={`/update-transaction/${id}`}
          className="bg-yellow-500 px-4 py-2 rounded text-white"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          className="bg-red-600 px-4 py-2 rounded text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TransactionDetails;
