# Secure Auth-Gateway: Enterprise-Grade RBAC System 🔐

A high-performance, full-stack authentication gateway designed with a **Security-First** mindset. This project demonstrates a robust bridge between a React-based client and a hardened Node.js/MySQL backend, implementing **Role-Based Access Control (RBAC)** and stateless session management.

## 🛡️ Architectural Highlights

### 1. Hardened Authentication Layer
* **Cryptographic Hashing:** Implements `bcrypt` with adaptive salt rounds to ensure password entropy and defense against brute-force/rainbow table attacks.
* **Stateless JWT Strategy:** Uses JSON Web Tokens for scalable, decentralized authorization, reducing server-side state overhead.
* **Granular Middleware Guards:** Backend routes are protected by a multi-layered middleware stack that verifies token integrity and user permissions before execution.

### 2. User & Identity Management
* **Dynamic Profile Control:** Integrated `Multer` for secure multi-part form handling, allowing users to manage digital assets (profile pictures) with live previews.
* **Stateful UI Feedback:** Leverages React Hooks and Axios interceptors to provide real-time validation and conditional navigation based on auth status.

### 3. Administrative Governance
* **The "Control Plane":** A dedicated Admin Dashboard that provides CRUD operations over the user database.
* **Security Actions:** Capability to block/unblock or rotate user credentials instantly, demonstrating a real-world administrative lifecycle.

## 🛠️ Technical Ecosystem

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, React Router 6, Vite, React Icons |
| **Backend** | Node.js, Express.js, JWT, Bcrypt |
| **Database** | MySQL (Relational Schema Design) |
| **DevOps/Tools** | Multer (File Ops), Dotenv (Secret Management), CORS |

## 📂 System Topology

```text
Secure-Auth-Gateway/
├── backend/                # REST API Architecture
│   ├── uploads/            # Sanitized user asset storage
│   ├── authMiddleware.js   # RBAC & Token validation logic
│   ├── db.js               # Optimized MySQL Connection Pool
│   └── server.js           # Express entry point & Route definitions
├── frontend/               # Component-Driven UI
│   ├── src/
│   │   ├── components/     # Modular UI elements (Navbar, etc.)
│   │   ├── pages/          # View logic (Auth, Profile, Admin)
│   │   └── service/        # Centralized API abstraction (Axios)
└── README.md

1.Initialization:

# Install Backend
cd backend && npm install

# Install Frontend
cd ../frontend && npm install

2.Execution: 
Run both tiers to begin: npm start (Backend) and npm run dev (Frontend).