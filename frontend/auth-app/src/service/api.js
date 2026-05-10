const API_URL = "http://localhost:5000";

// ================= REGISTER =================
export const registerUser = async (data) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
   if (!response.ok) {
    throw new Error(result.message || "Registration failed");
  }

  return result;
};
// ================= LOGIN =================
export const loginUser = async (data) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
};
// ================= PROFILE =================
export const fetchProfile = async (token) => {
  const response = await fetch(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load profile");
  }
  return result;
};
// ================= GET USERS =================
export const fetchUsers = async (token) => {
  const response = await fetch(`${API_URL}/admin/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch users");
  }

  return result;
};
// ================= DELETE USER =================
export const deleteUser = async (id, token) => {
  const response = await fetch(`${API_URL}/admin/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete user");
  }

  return result;
};

// ================= BLOCK USER =================
export const blockUser = async (id, token) => {
  const response = await fetch(`${API_URL}/admin/block/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to block user");
  }

  return result;
};

// ================= UNBLOCK USER =================
export const unblockUser = async (id, token) => {
  const response = await fetch(`${API_URL}/admin/unblock/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to unblock user");
  }

  return result;
};