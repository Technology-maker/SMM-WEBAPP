import api from "./axios";

export const createDeposit = (payload) => api.post("/payment/deposit", payload).then((res) => res.data);
export const verifyPayment = (payload) => api.post("/payment/verify", payload).then((res) => res.data);
export const getMyTransactions = (params = {}) => api.get("/payment/my", { params }).then((res) => res.data);


// ✅ NEW: manual UPI — amount + utr submitted together
export const submitManualPayment = (payload) => api.post("/payment/deposit", { method: "upi", ...payload }).then((res) => res.data);
export const getDepositSettings = () => api.get("/payment/deposit-settings").then((res) => res.data);
