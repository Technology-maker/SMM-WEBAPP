import api from "./axios";

export const createOrder = (payload) => api.post("/orders/new", payload).then((res) => res.data);
export const getMyOrders = (params = {}) => api.get("/orders/my", { params }).then((res) => res.data);
export const getOrder = (id) => api.get(`/orders/${id}`).then((res) => res.data);
