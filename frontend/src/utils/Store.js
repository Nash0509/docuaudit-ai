import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      topBar: "dashboard",
      setTopBar: (value) => set({ topBar: value }),
      
      theme: "light",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),

      isSidebarMinimized: false,
      toggleSidebarMinimized: () => set((state) => ({ isSidebarMinimized: !state.isSidebarMinimized })),
      
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
      partialize: (state) => ({ token: state.token, user: state.user, theme: state.theme }), // Persist token, user and theme
    }
  )
);

export default useStore;