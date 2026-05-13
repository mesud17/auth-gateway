# 🔐 Auth Gateway

A full-stack authentication and user management web application built with React, Node.js, Express, and MySQL. Features JWT-based authentication, role-based access control, profile management, and an admin dashboard.

**🌐 Live Demo:** [https://auth-gateway.vercel.app](https://auth-gateway.vercel.app)

---

## 📸 Screenshots

| Login Page | Profile Page | Admin Dashboard |
|---|---|---|
| Clean login UI with email/password | View and edit your profile | Manage all users as admin |

---

## ✨ Features

- **User Registration & Login** — secure authentication with hashed passwords
- **JWT Authentication** — stateless token-based auth with 1-hour expiry
- **Role-Based Access Control** — `user` and `admin` roles with protected routes
- **Profile Management** — update username, email, password, and profile image
- **Admin Dashboard** — view all users, block/unblock, and delete accounts
- **Rate Limiting** — login endpoint limited to 10 attempts per 15 minutes
- **Input Validation** — server-side validation on all endpoints
- **Secure by Design** — admins cannot block or delete their own account

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool |
| React Router DOM 7 | Client-side routing |
| Axios | HTTP client |
| React Icons | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express 5 | Web framework |
| mysql2 | MySQL database driver |
| bcrypt | Password hashing |
| jsonwebtoken | JWT generation & verification |
| multer | File upload handling |
| express-rate-limit | Brute-force protection |
| dotenv | Environment variable management |
| cors | Cross-Origin Resource Sharing |

### Database
| Technology | Purpose |
|---|---|
| MySQL 8 | Relational database |

---

## 📁 Project Structure

```
auth-gateway/
├── backend/
│   ├── uploads/              # Uploaded profile images
│   ├── adminMiddleware.js    # Admin role guard middleware
│   ├── authMiddleware.js     # JWT verification middleware
│   ├── db.js                 # MySQL connection pool
│   ├── server.js             # Express app & all routes
│   ├── package.json
│   └── .env                  # Environment variables (not committed)
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar/       # Navigation bar
    │   │   └── ProtectedRoute/ # Auth guard for private routes
    │   ├── pages/
    │   │   ├── Log-in/       # Login page
    │   │   ├── Register/     # Registration page
    │   │   ├── Profile/      # User profile page
    │   │   └── AdminDashboard/ # Admin user management page
    │   ├── service/
    │   │   └── api.js        # All API calls centralized
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

---

## 🗄️ Database Schema

```sql
CREATE TABLE users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(100) NOT NULL,
    email         VARCHAR(100) UNIQUE NOT NULL,
    password      VARCHAR(255) NOT NULL,
    role          ENUM('user', 'admin') DEFAULT 'user',
    status        ENUM('active', 'blocked') DEFAULT 'active',
    profile_image VARCHAR(255) DEFAULT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Register a new user |
| POST | `/login` | ❌ | Login and receive JWT token |

### User
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/profile` | ✅ | Get current user's profile |
| PUT | `/update-profile` | ✅ | Update profile (supports image upload) |

### Admin
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/admin/users` | ✅ | Admin | Get all users |
| PUT | `/admin/block/:id` | ✅ | Admin | Block a user |
| PUT | `/admin/unblock/:id` | ✅ | Admin | Unblock a user |
| DELETE | `/admin/delete/:id` | ✅ | Admin | Delete a user |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MySQL database (local or cloud)

### 1. Clone the Repository

```bash
git clone https://github.com/mesud17/auth-gateway.git
cd auth-gateway
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
DB_HOST=your_mysql_host
DB_PORT=your_mysql_port
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
JWT_SECRET=your_super_secret_key
PORT=5000
```

Create the database table:

```sql
CREATE TABLE users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(100) NOT NULL,
    email         VARCHAR(100) UNIQUE NOT NULL,
    password      VARCHAR(255) NOT NULL,
    role          ENUM('user', 'admin') DEFAULT 'user',
    status        ENUM('active', 'blocked') DEFAULT 'active',
    profile_image VARCHAR(255) DEFAULT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Start the backend:

```bash
node server.js
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The app will be running at `http://localhost:5173`

---

## 🚀 Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://auth-gateway.vercel.app |
| Backend | Render | https://auth-gateway-7qkw.onrender.com |
| Database | Railway | MySQL (cloud) |

### Deploy Frontend (Vercel)
1. Import repo on [vercel.com](https://vercel.com)
2. Set Root Directory to `frontend`
3. Add environment variable: `VITE_API_URL=https://auth-gateway-7qkw.onrender.com`
4. Deploy

### Deploy Backend (Render)
1. Create Web Service on [render.com](https://render.com)
2. Set Root Directory to `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all DB environment variables

---

## 🔒 Security Features

- Passwords hashed with **bcrypt** (salt rounds: 10)
- JWT tokens expire after **1 hour**
- Login rate limited to **10 requests per 15 minutes**
- Generic error messages to prevent **email enumeration**
- Admins **cannot block or delete** their own account
- File uploads restricted to **JPEG, PNG, WebP** only, max **2MB**
- SSL required for all **database connections**

---

## 📝 Environment Variables

### Backend `.env`
| Variable | Description |
|---|---|
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `PORT` | Server port (default: 5000) |

### Frontend `.env`
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## 👤 Author

**Mesud** — [@mesud17](https://github.com/mesud17)

---

## 📄 License

This project is licensed under the ISC License.