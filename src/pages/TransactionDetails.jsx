import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import Swal from "sweetalert2";

const formatDate = (d) => {
  if (!d) return "-";
  if (d.seconds && typeof d.seconds === "number") {
    return new Date(d.seconds * 1000).toLocaleDateString();
  }
  const maybeDate = new Date(d);
  if (!isNaN(maybeDate)) return maybeDate.toLocaleDateString();
  return String(d);
};

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
          Swal.fire("Error!", "Transaction not found!", "error");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error!", "Failed to fetch transaction!", "error");
      }
    };

    fetchTransaction();
  }, [id]);

  const handleDelete = async () => {
    const result = await Swal.fire({
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
        Swal.fire("Deleted!", "Transaction has been deleted.", "success");
        navigate("/my-transactions");
      } catch (error) {
        console.error(error);
        Swal.fire("Error!", "Failed to delete transaction!", "error");
      }
    }
  };

  if (!transaction) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div
        className="p-6 rounded-xl shadow-xl mb-10"
        style={{
          backgroundColor: "#FDF2F8",
          border: "1px solid #FBCFE8",
        }}
      >
        <h3 className="text-xl font-bold mb-4" style={{ color: "#DB2777" }}>
          My Transaction
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead
              style={{
                backgroundColor: "#FFFFFFAA",
                backdropFilter: "blur(6px)",
              }}
            >
              <tr className="border-b" style={{ borderColor: "#E5E7EB" }}>
                <th className="p-3 text-gray-700 text-center">Title</th>
                <th className="p-3 text-gray-700 text-center">Type</th>
                <th className="p-3 text-gray-700 text-center">Category</th>
                <th className="p-3 text-gray-700 text-center">Amount</th>
                <th className="p-3 text-gray-700 text-center">Date</th>
                <th className="p-3 text-gray-700 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr
                className="border-b hover:bg-white/70 transition"
                style={{ borderColor: "#E5E7EB" }}
              >
                <td className="p-3 text-center">{transaction.title}</td>
                <td className="p-3 text-center capitalize">
                  {transaction.type}
                </td>
                <td className="p-3 text-center">{transaction.category}</td>
                <td className="p-3 text-center font-semibold">
                  ${transaction.amount}
                </td>
                <td className="p-3 text-center">
                  {formatDate(transaction.date)}
                </td>
                <td className="p-3 flex justify-center gap-3">
                  <Link
                    to={`/update-transaction/${transaction.id}`}
                    className="px-3 py-1 bg-blue-400 text-white rounded hover:bg-blue-500 transition cursor-pointer"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={handleDelete}
                    className="px-3 py-1 bg-red-400 text-white rounded hover:bg-red-500 transition cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
