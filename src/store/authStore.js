import { create } from "zustand";

const useAuthStore = create((set) => ({
    currentUser: null,
    isCheckingUser: true,
    setIsCheckingUser: () => set((state) => ({isCheckingUser: !state.isCheckingUser})),
    setCurrentUser: (user) => set({currentUser: user})
}))

export default useAuthStore;