import { useEffect, useState } from "react";
import {
  fetchUsers,
  deleteUser,
  blockUser,
  unblockUser,
} from "../../service/api";

import "./AdminDashboard.css";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const loadUsers = async () => {
    try {
      const data = await fetchUsers(token);
      setUsers(data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) return;

    try {
      await deleteUser(id, token);
      loadUsers();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleBlock = async (id) => {
    try {
      await blockUser(id, token);
      loadUsers();
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleUnblock = async (id) => {
    try {
      await unblockUser(id, token);
      loadUsers();
    } catch (error) {
      console.log(error.message);
    }
  };

  if (loading) {
    return <h2 className="loading">Loading...</h2>;
  }
  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span
                    className={
                      user.status === "blocked"
                        ? "blocked-status"
                        : "active-status"
                    }
                  >
                    {user.status}
                  </span>
                </td>

                <td className="actions">
                  {user.status === "active" ? (
                    <button
                      className="block-btn"
                      onClick={() => handleBlock(user.id)}
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      className="unblock-btn"
                      onClick={() => handleUnblock(user.id)}
                    >
                      Unblock
                    </button>
                  )}
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
