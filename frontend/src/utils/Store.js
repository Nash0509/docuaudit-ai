import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      topBar: "dashboard",
      setTopBar: (value) => set({ topBar: value }),
      
      token: null,
      user: null,
      isSidebarOpen: false, // For mobile menu toggle
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      setIsSidebarOpen: (value) => set({ isSidebarOpen: value }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      logout: () => set({ token: null, user: null, isSidebarOpen: false })
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token, user: state.user }), // Persist token and user
    }
  )
);

export default useStore;