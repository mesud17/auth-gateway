import { Link, useNavigate } from "react-router-dom";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">SecureAuth</h2>

      <ul className="nav-links">
        {!token ? (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>

            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/profile">Profile</Link>
            </li>

            {role === "admin" && (
              <li>
                <Link to="/admin">
                  Admin Dashboard
                </Link>
              </li>
            )}

            <li>
              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;