import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Auth store to manage user session and tokens
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) => 
        set({ user, accessToken, refreshToken, isAuthenticated: true }),

      updateToken: (accessToken) => 
        set({ accessToken }),

      logout: () => 
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // name of the item in storage (localStorage by default)
    }
  )
);
