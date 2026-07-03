import api from "./axios";

export const getCategories = () => api.get("/categories").then((res) => res.data);
export const getServices = (params = {}) => api.get("/services", { params }).then((res) => res.data);
export const getService = (id) => api.get(`/services/${id}`).then((res) => res.data);
export const getAdminDashboard = () => api.get("/admin/dashboard").then((res) => res.data);
export const adminList = (resource, params = {}) => api.get(`/admin/${resource}`, { params }).then((res) => res.data);
export const adminCreate = (resource, payload) => api.post(`/admin/${resource}`, payload).then((res) => res.data);
export const adminUpdate = (resource, id, payload) => api.put(`/admin/${resource}/${id}`, payload).then((res) => res.data);
export const adminDelete = (resource, id) => api.delete(`/admin/${resource}/${id}`).then((res) => res.data);
export const getSettings = () => api.get("/admin/settings").then((res) => res.data);
export const updateSettings = (payload) => api.put("/admin/settings", payload).then((res) => res.data);
