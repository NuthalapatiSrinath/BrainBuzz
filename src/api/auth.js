// src/api/auth.js
import api from "./apiClient";

export async function register(payload) {
  // payload: { name, email, password }
  const res = await api.post("/auth/register", payload);
  return res.data;
}

export async function login({ email, password }) {
  const res = await api.post("/auth/login", { email, password });
  // expected response { success:true, data:user, token }
  if (res.data?.token) {
    localStorage.setItem("bb_token", res.data.token);
  }
  return res.data;
}

export function logout() {
  localStorage.removeItem("bb_token");
}
