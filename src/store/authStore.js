import { create } from "zustand";

const useAuthStore = create((set) => ({
    currentUser: null,
    isCheckingUser: true,
    setIsCheckingUser: (value) => set({ isCheckingUser: value }),
    setCurrentUser: (user) => set({ currentUser: user })
}))

export default useAuthStore;