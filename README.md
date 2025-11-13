# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

# 💰 FinEase - Personal Finance Management Web App

**FinEase** is a modern personal finance management web application that helps users manage their income, expenses, and savings goals in one place. Users can record transactions, set monthly budgets, and view insightful financial summaries through interactive charts and detailed reports.

---

## 🌐 Live Site URL

🔗 [Live Client Site](https://venerable-buttercream-a62771.netlify.app/)  
🔗 [Live Server (Vercel)](https://finease-server.vercel.app)

---

## ✨ Key Features

- 🔐 **User Authentication:** Secure email/password and Google login via Firebase.
- 💵 **CRUD Operations:** Add, update, view, and delete your transactions.
- 📊 **Dynamic Reports:** Visualize your financial data with pie & bar charts.
- 🧑‍💻 **User Dashboard:** See your personalized transaction history and totals.
- 🌗 **Dark/Light Mode:** Switch seamlessly between dark and light themes.
- 🚀 **Responsive UI:** Fully responsive on desktop, tablet, and mobile devices.
- 🔔 **Custom Alerts:** SweetAlert & Toast notifications for all actions.
- 🔄 **Instant Updates:** Changes reflect immediately after CRUD operations.
- ⚙️ **Backend Integration:** Powered by Node.js, Express, MongoDB, and Firebase Auth.

---

## 📁 Project Structure

### **Client (Frontend)**

- React + Vite
- React Router DOM
- Firebase Authentication
- Tanstack Query (optional)
- Recharts for data visualization
- SweetAlert2 / React Toastify for notifications

### **Server (Backend)**

- Node.js + Express.js
- MongoDB (Mongoose)
- Firebase Admin SDK for token verification
- CRUD API endpoints for transactions

---

## 🔒 Protected Routes

| Route                     | Description                     | Access  |
| ------------------------- | ------------------------------- | ------- |
| `/add-transaction`        | Add new transaction             | Private |
| `/my-transactions`        | View all user transactions      | Private |
| `/transaction/:id`        | View details of one transaction | Private |
| `/transaction/update/:id` | Edit existing transaction       | Private |
| `/reports`                | Financial summary & charts      | Private |
| `/profile`                | View & update user profile      | Private |

---

## 🧠 Technologies Used

**Frontend:** React, Firebase, Recharts, Tailwind CSS, SweetAlert2  
**Backend:** Node.js, Express.js, MongoDB, Firebase Admin SDK  
**Hosting:** Netlify (client)

---

## 🛠️ Installation & Setup

### Clone the repository

```bash
git clone https://github.com/yourusername/finease.git
cd finease
```
