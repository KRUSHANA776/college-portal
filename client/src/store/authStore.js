import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: (() => {
    try {
      const savedUser = sessionStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  })(),
  setUser: (user) => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
    set({ user });
  },
  logout: () => {
    sessionStorage.removeItem('user');
    set({ user: null });
  },
}));
