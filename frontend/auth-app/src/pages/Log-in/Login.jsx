import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../service/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginUser(formData);
      localStorage.setItem("token", result.token);
      setMessage(result.message);
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Login to continue</p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit">Login</button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <p className="bottom-text">
          Don't have an account?
          <Link to="/register"> Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
