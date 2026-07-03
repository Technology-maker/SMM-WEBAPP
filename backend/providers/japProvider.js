import { createSmmApiProvider } from "./smmApiProviderFactory.js";

const japProvider = createSmmApiProvider({
  label: "JAP",
  baseURL: process.env.JAP_API_URL || "https://justanotherpanel.com/api/v2",
  apiKey: process.env.JAP_API_KEY
});

export default japProvider;