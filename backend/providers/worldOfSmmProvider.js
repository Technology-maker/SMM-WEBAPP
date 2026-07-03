import { createSmmApiProvider } from "./smmApiProviderFactory.js";

const worldOfSmmProvider = createSmmApiProvider({
  label: "WorldOfSMM",
  baseURL: process.env.WORLDOFSMM_API_URL || "https://worldofsmm.com/api/v2",
  apiKey: process.env.WORLDOFSMM_API_KEY
});

export default worldOfSmmProvider;