import api from "./axios";

export const getNotices = () => api.get("/notices").then((res) => res.data);
