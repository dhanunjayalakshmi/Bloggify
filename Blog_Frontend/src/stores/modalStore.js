import { create } from "zustand";

export const useModalStore = create((set) => ({
  isOpen: false,
  mode: "login", // "login" | "signup" | "forgot"
  openModal: (mode = "login") => set({ isOpen: true, mode }),
  closeModal: () => set({ isOpen: false }),
  setMode: (mode) => set({ mode }),
}));
