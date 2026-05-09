import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <nav className="topbar">
      <Link to="/" className="brand">
        SecureAuth
      </Link>
      <div className="topbar-links">
        {!token ? (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link nav-link-primary">
              Register
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
