import axios from "axios";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates a provider client for any panel that implements the common
 * "SMM Panel API v2" spec: POST action=services/add/status with a `key`.
 * Peakerr, JAP (JustAnotherPanel), and most reseller panels all follow
 * this same protocol, so one factory covers all of them — only the
 * base URL and API key differ per provider.
 */
export const createSmmApiProvider = ({ label, baseURL, apiKey }) => {
  const client = axios.create({
    baseURL,
    timeout: 15000,
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });

  const requestWithRetry = async (payload, retries = 2) => {
    if (!apiKey) {
      const error = new Error(`${label} API key is not configured`);
      error.code = "PROVIDER_NOT_CONFIGURED";
      throw error;
    }

    const body = new URLSearchParams({ key: apiKey, ...payload });

    let lastError;
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        const { data } = await client.post("", body);
        if (data?.error) {
          const error = new Error(data.error);
          error.responseData = data;
          throw error;
        }
        return data;
      } catch (error) {
        lastError = error;
        if (attempt < retries) {
          await sleep(500 * (attempt + 1));
        }
      }
    }

    throw lastError;
  };

  return {
    label,
    getServices: () => requestWithRetry({ action: "services" }),
    // Do NOT retry 'add' (create order) requests: if the first request
    // actually succeeded but the response was lost, retrying may create
    // a duplicate order and double-charge. Set retries to 0 for 'add'.
    createOrder: (serviceId, link, quantity) =>
      requestWithRetry({
        action: "add",
        service: String(serviceId),
        link,
        quantity: String(quantity)
      }, 0),
    getOrderStatus: (orderId) => requestWithRetry({ action: "status", order: String(orderId) })
  };
};