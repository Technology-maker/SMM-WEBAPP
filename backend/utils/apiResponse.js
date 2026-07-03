export const sendResponse = (res, statusCode, success, message, data = null) => {
  res.status(statusCode).json({ success, message, data });
};

export const ok = (res, message, data = null, statusCode = 200) => {
  sendResponse(res, statusCode, true, message, data);
};

export const fail = (res, statusCode, message, data = null) => {
  sendResponse(res, statusCode, false, message, data);
};
