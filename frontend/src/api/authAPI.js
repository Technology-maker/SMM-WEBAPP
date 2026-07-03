import api from "./axios";

export const registerUser = (payload) => api.post("/auth/register", payload).then((res) => res.data);
export const loginUser = (payload) => api.post("/auth/login", payload).then((res) => res.data);
export const getMe = () => api.get("/auth/me").then((res) => res.data);
export const logoutUser = () => api.post("/auth/logout").then((res) => res.data);
export const getUserDashboard = () => api.get("/user/dashboard").then((res) => res.data);
export const updateProfile = (payload) => api.put("/user/profile", payload).then((res) => res.data);

export const forgotPassword = (email) => api.post("/user/forgot-password", { email }).then((res) => res.data);
export const verifyOTP = (email, otp) => api.post("/user/verify-otp", { email, otp }).then((res) => res.data);
export const changePassword = (email, payload) => api.post("/user/change-password", { email, ...payload }).then((res) => res.data);
export const contactUs = (payload) => api.post("/user/contact", payload).then((res) => res.data);