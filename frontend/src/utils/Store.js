import { create } from "zustand";

const useStore = create((set) => ({
  topBar: 'dashboard',
  setTopBar: (value) => set({ topBar: value }),
}));

export default useStore;