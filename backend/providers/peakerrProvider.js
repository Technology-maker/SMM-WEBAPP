import { createSmmApiProvider } from "./smmApiProviderFactory.js";

const peakerrProvider = createSmmApiProvider({
  label: "Peakerr",
  baseURL: process.env.PEAKERR_API_URL || "https://peakerr.com/api/v2",
  apiKey: process.env.PEAKERR_API_KEY
});

export default peakerrProvider;