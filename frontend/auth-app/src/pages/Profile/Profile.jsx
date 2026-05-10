import { useEffect, useState } from "react";
import { fetchProfile } from "../../service/api";
import { Link } from "react-router-dom";

import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const result = await fetchProfile(token);

        setUser(result.user);
      } catch (error) {
        console.log(error);
      }
    };

    getProfile();
  }, []);

  if (!user) {
    return <h2 className="loading">Loading...</h2>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>

          <h1 className="profile-title">
            Welcome, {user.username}
          </h1>

          <p className="profile-subtitle">
            Your account information
          </p>
        </div>

        <div className="profile-info">
          <div className="info-box">
            <span>Username</span>
            <h3>{user.username}</h3>
          </div>

          <div className="info-box">
            <span>Email</span>
            <h3>{user.email}</h3>
          </div>

          <div className="info-box">
            <span>Role</span>

            <h3
              className={
                user.role === "admin"
                  ? "admin-role"
                  : "user-role"
              }
            >
              {user.role}
            </h3>
          </div>

          <div className="info-box">
            <span>Status</span>

            <h3
              className={
                user.status === "blocked"
                  ? "blocked-status"
                  : "active-status"
              }
            >
              {user.status}
            </h3>
          </div>
        </div>

        {user.role === "admin" && (
          <div className="admin-btn-wrapper">
            <Link to="/admin" className="admin-dashboard-btn">
              Go to Admin Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;