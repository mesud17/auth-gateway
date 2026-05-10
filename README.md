# Secure Auth Gateway 🔐

A modern full-stack authentication and user management system built with a strong focus on:

- Security
- Scalability
- User Experience
- Professional UI/UX
- Real-world Backend Architecture

This project provides a secure bridge between a React frontend and a Node.js + MySQL backend using JWT authentication and role-based authorization.

---

# 🚀 Features

## 🔑 Authentication System

- Secure User Registration
- Login Authentication
- JWT-Based Authorization
- Protected Routes
- Persistent User Sessions
- Password Hashing with Bcrypt
- Password Visibility Toggle

---

## 👤 User Profile System

- Professional Profile Dashboard
- Edit Profile Functionality
- Upload Profile Pictures
- Change Username
- Change Email
- Change Password
- Live Profile Image Preview

---

## 🛡️ Admin Dashboard

- View All Users
- Block / Unblock Users
- Delete Users
- Role-Based Access Control
- Admin Protected Routes

---

## 🎨 Professional UI

- Modern Glassmorphism Design
- Responsive Layout
- Dynamic Navbar
- Conditional Navigation
- Loading States
- Interactive Hover Effects

---

# 🛠️ Tech Stack

## Frontend

- React
- React Router DOM
- React Hooks
- React Icons
- CSS3

---

## Backend

- Node.js
- Express.js
- MySQL
- JWT Authentication
- Bcrypt
- Multer
- CORS
- dotenv

---

# 📂 Project Structure

```text
Secure-Auth-Gateway/
│
├── backend/
│   ├── uploads/
│   ├── authMiddleware.js
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar/
│   │   │
│   │   ├── pages/
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   ├── Profile/
│   │   │   └── AdminDashboard/
│   │   │
│   │   ├── service/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md