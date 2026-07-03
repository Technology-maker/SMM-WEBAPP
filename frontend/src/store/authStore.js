import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  bootstrapped: false,
  setUser: (user) => set({ user, isAuthenticated: Boolean(user), bootstrapped: true }),
  clearUser: () => set({ user: null, isAuthenticated: false, bootstrapped: true }),
  setBootstrapped: () => set({ bootstrapped: true })
}));

export default useAuthStore;
