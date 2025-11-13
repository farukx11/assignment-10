import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AddTransaction from "../pages/AddTransaction";
import MyTransactions from "../pages/MyTransactions";
import UpdateTransaction from "../pages/UpdateTransaction";
import TransactionDetails from "../pages/TransactionDetails";
import Reports from "../pages/Reports";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import PrivateRoute from "../components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Layout on every page except 404
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },

      // ✅ Private Routes
      {
        path: "/add-transaction",
        element: (
          <PrivateRoute>
            <AddTransaction />
          </PrivateRoute>
        ),
      },
      {
        path: "/my-transactions",
        element: (
          <PrivateRoute>
            <MyTransactions />
          </PrivateRoute>
        ),
      },
      {
        path: "/transaction/update/:id",
        element: (
          <PrivateRoute>
            <UpdateTransaction />
          </PrivateRoute>
        ),
      },
      {
        path: "/transaction/:id",
        element: (
          <PrivateRoute>
            <TransactionDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/reports",
        element: (
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
    ],
  },

  // ✅ 404 without Layout
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
