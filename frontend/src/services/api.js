import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
});

export const getDocuments = async () => {
  const res = await API.get("/documents/list");

  return res.data;
};

export const uploadDocument = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const res = await API.post(
    "/documents/upload",

    formData,

    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return res.data;
};

export const runAudit = async (id) => {
  const res = await API.post(`/audit/run/${id}`);

  return res.data;
};

export const getAuditResult = async (id) => {
  const res = await API.get(`/audit/result/${id}`);

  return res.data;
};

export const getAllAuditResult = async (id) => {
  const res = await API.get(`/audit/results`);

  return res.data;
};

export const deleteDocument = async (id) => {
  const res = await API.delete(`/documents/${id}`);

  return res.data;
};
