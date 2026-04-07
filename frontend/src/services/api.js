import axios from "axios";
import useStore from "../utils/Store";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
});

API.interceptors.request.use((config) => {
  const state = useStore.getState();
  if (state.token) {
    config.headers.Authorization = `Bearer ${state.token}`;
  }
  return config;
});

// -------------
// Auth APIs
// -------------

export const loginUser = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  return res.data;
};

export const registerUser = async (email, password) => {
  const res = await API.post("/auth/register", { email, password });
  return res.data;
};

export const loginGuest = async () => {
  const res = await API.post("/auth/guest-login");
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await API.get("/auth/me");
  return res.data;
};

export const updatePassword = async (new_password) => {
  const res = await API.put("/auth/password", { new_password });
  return res.data;
};

// -------------
// Document APIs
// -------------

export const getDocuments = async () => {
  const res = await API.get("/documents/list");
  return res.data;
};

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await API.post("/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// -------------
// Rule APIs
// -------------

export const getRules = async () => {
  const res = await API.get("/rules");
  return res.data;
};

export const createRule = async (data) => {
  const res = await API.post("/rules", data);
  return res.data;
};

export const updateRule = async (id, data) => {
  const res = await API.put(`/rules/${id}`, data);
  return res.data;
};

export const deleteRule = async (id) => {
  const res = await API.delete(`/rules/${id}`);
  return res.data;
};

export const runAudit = async (id, rule_ids = []) => {
  const res = await API.post(`/audit/run/${id}`, { rule_ids });
  return res.data;
};

export const getAuditResult = async (id) => {
  const res = await API.get(`/audit/result/${id}`);
  return res.data;
};

export const getAllAuditResult = async () => {
  const res = await API.get(`/audit/results`);
  return res.data;
};

export const deleteDocument = async (id) => {
  const res = await API.delete(`/documents/${id}`);
  return res.data;
};

// -------------
// Settings APIs
// -------------

export const getSettings = async () => {
  const res = await API.get("/settings");
  return res.data;
};

export const updateSettings = async (data) => {
  const res = await API.put("/settings", data);
  return res.data;
};

// -------------
// Activity APIs
// -------------

export const getActivities = async () => {
  const res = await API.get("/activities");
  return res.data;
};

// -------------
// Notification APIs
// -------------

export const getUnreadCount = async () => {
  const res = await API.get("/notifications/unread-count");
  return res.data;
};

// -------------
// Billing APIs
// -------------

export const createCheckoutSession = async () => {
  const res = await API.post("/billing/create-checkout-session");
  return res.data;
};

export const mockSuccessCheckout = async () => {
  const res = await API.post("/billing/test-mock-success");
  return res.data;
};
