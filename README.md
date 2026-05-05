# Secure Auth Gateway 🔐

A professional full-stack authentication system designed with a focus on **security**, **scalability**, and **DevOps best practices**. This project implements a secure bridge between a React frontend and a Node.js/MySQL backend.

## 🚀 Features

*   **Secure Registration:** Validates user input and hashes passwords using `bcrypt`.
*   **JWT Authentication:** Uses JSON Web Tokens for stateless, secure user sessions.
*   **Protected Routes:** Custom middleware ensures only authorized users can access sensitive endpoints.
*   **Persistent Login:** Tokens are managed via `localStorage` with Axios Interceptors for seamless API calls.
*   **Environment Safety:** All sensitive credentials (DB passwords, JWT secrets) are managed via `.env` files.

## 🛠️ Tech Stack

### Backend
*   **Node.js & Express:** Server-side logic and RESTful API.
*   **MySQL:** Relational database for persistent user storage.
*   **Bcrypt:** Industry-standard password hashing.
*   **JWT (JsonWebToken):** Identity verification and authorization.

### Frontend
*   **React:** Functional components and Hooks (`useState`, `useEffect`).
*   **React Router:** Single Page Application (SPA) navigation.
*   **Axios:** Centralized API communication with request interceptors.

## 📂 Project Structure

```text
├── backend/
│   ├── db.js             # MySQL Connection Pool
│   ├── server.js         # Express Routes & Entry Point
│   ├── authMiddleware.js # JWT Verification Logic
│   └── .env              # Configuration (Not committed to Git)
└── frontend/
    ├── src/
    │   ├── api.js        # Axios Interceptor Config
    │   ├── App.js        # Routing & Main Layout
    │   ├── Login.js      # Auth Logic
    │   └── Profile.js    # Protected Component


⚙️ Setup & Installation

1. Clone the repository
git clone https://github.com/mesud17/auth-gateway.git

2. **Backend Setup**
   * Navigate to `/backend`.
   * Run `npm install`.
   * Create a `.env` file and add your MySQL and JWT secret credentials.
   * Run `node server.js` or `npm run dev`.

3. **Frontend Setup**
   * Navigate to `/frontend`.
   * Run `npm install`.
   * Run `npm start`.

## 🛡️ Security Implementation
This project follows the **Fail-Fast** DevOps principle:
1. The server pings the MySQL database on startup; if the connection fails, the process exits with an error.
2. Cross-Origin Resource Sharing (**CORS**) is configured to only allow trusted origins.
3. Passwords are never stored in plain text, utilizing a salt factor of 10.