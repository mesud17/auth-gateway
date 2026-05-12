import { useEffect, useState } from "react";
import {
  fetchProfile,
  updateProfile,
} from "../../service/api";

import { Link } from "react-router-dom";

import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);

  const [showEdit, setShowEdit] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profile_image: null,
  });

  const token = localStorage.getItem("token");

  const getProfile = async () => {
    try {
      const result = await fetchProfile(token);

      setUser(result.user);

      setFormData({
        username: result.user.username,
        email: result.user.email,
        password: "",
        profile_image: null,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profile_image") {
      setFormData({
        ...formData,
        profile_image: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);

      if (formData.profile_image) {
        data.append(
          "profile_image",
          formData.profile_image
        );
      }

      await updateProfile(data, token);

      alert("Profile updated successfully");

      setShowEdit(false);

      getProfile();
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!user) {
    return <h2 className="loading">Loading...</h2>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* PROFILE VIEW */}
        {!showEdit ? (
          <>
            <div className="profile-header">
              <div className="profile-image-wrapper">
                {user.profile_image ? (
                  <img
                    src={`http://localhost:5000/uploads/${user.profile_image}`}
                    alt="Profile"
                    className="profile-image"
                  />
                ) : (
                  <div className="profile-avatar">
                    {user.username
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
              </div>

              <h1 className="profile-title">
                {user.username}
              </h1>

              <p className="profile-subtitle">
                {user.email}
              </p>
            </div>

            <div className="profile-info">
              <div className="info-box">
                <span>Role</span>
                <h3>{user.role}</h3>
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

            <div className="profile-actions">
              <button
                className="edit-btn"
                onClick={() => setShowEdit(true)}
              >
                Edit Profile
              </button>

              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="admin-dashboard-btn"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </>
        ) : (
          <>
            {/* EDIT PROFILE */}
            <h1 className="edit-title">
              Update Profile
            </h1>

            <form
              className="profile-form"
              onSubmit={handleSubmit}
            >
              <div className="upload-wrapper">
                <label
                  htmlFor="profileUpload"
                  className="upload-circle"
                >
                  {formData.profile_image ? (
                    <img
                      src={URL.createObjectURL(
                        formData.profile_image
                      )}
                      alt="Preview"
                      className="profile-image"
                    />
                  ) : user.profile_image ? (
                    <img
                      src={`http://localhost:5000/uploads/${user.profile_image}`}
                      alt="Profile"
                      className="profile-image"
                    />
                  ) : (
                    <div className="profile-avatar">
                      {user.username
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}

                  <div className="upload-overlay">
                    Change
                  </div>
                </label>

                <input
                  type="file"
                  id="profileUpload"
                  name="profile_image"
                  onChange={handleChange}
                  hidden
                />
              </div>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="New Password"
              />

              <button type="submit">
                Save Changes
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowEdit(false)}
              >
                Cancel
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;