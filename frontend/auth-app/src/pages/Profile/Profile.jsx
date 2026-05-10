import { useEffect, useState } from "react";
import { fetchProfile, updateProfile } from "../../service/api";

import { Link } from "react-router-dom";

import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);

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
        data.append("profile_image", formData.profile_image);
      }
      await updateProfile(data, token);

      alert("Profile updated successfully");

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
        <div className="profile-header">
          {user.profile_image ? (
            <img
              src={`http://localhost:5000/uploads/${user.profile_image}`}
              alt="Profile"
              className="profile-image"
            />
          ) : (
            <div className="profile-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}

          <h1 className="profile-title">{user.username}</h1>

          <p className="profile-subtitle">{user.email}</p>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
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

          <input type="file" name="profile_image" onChange={handleChange} />

          <button type="submit">Update Profile</button>
        </form>
        {user.role === "admin" && (
          <div className="admin-btn-wrapper">
            <Link to="/admin" className="admin-dashboard-btn">
              Go To Admin Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
export default Profile;
