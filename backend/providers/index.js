import peakerrProvider from "./peakerrProvider.js";
import japProvider from "./japProvider.js";
import worldOfSmmProvider from "./worldOfSmmProvider.js";

/**
 * Maps Service.providerName -> provider client.
 *
 * To add a new provider:
 *   1. Create providers/xProvider.js (reuse createSmmApiProvider if the
 *      panel follows the standard SMM Panel API v2 spec, like Peakerr/JAP do).
 *   2. Import it below and add it to this registry.
 *   3. Add its name to the providerName enum in models/Service.js and to
 *      the validator in routes/adminRoutes.js.
 * No changes needed in orderController.js — it looks providers up by name.
 */
const registry = {
  Peakerr: peakerrProvider,
  JAP: japProvider,
  WorldOfSMM: worldOfSmmProvider
};

export const getProvider = (providerName) => registry[providerName] || null;

export default registry;