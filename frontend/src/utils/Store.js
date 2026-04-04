import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      topBar: "dashboard",
      setTopBar: (value) => set({ topBar: value }),
      
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null })
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token, user: state.user }), // Persist token and user
    }
  )
);

export default useStore;