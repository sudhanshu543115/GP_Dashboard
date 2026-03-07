import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const createInvoice = (data) =>
  axios.post(`${API}/invoices`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

export const updateInvoice = (id, data) =>
  axios.put(`${API}/invoices/${id}`, data);

export const getInvoice = (id) =>
  axios.get(`${API}/invoices/${id}`);

export const getInvoices = () =>
  axios.get(`${API}/invoices`);

export const deleteInvoice = (id) =>
  axios.delete(`${API}/invoices/${id}`);