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
      _hasHydrated: false,

      setAuth: (user, accessToken, refreshToken) => 
        set({ user, accessToken, refreshToken, isAuthenticated: true }),

      updateToken: (accessToken) => 
        set({ accessToken }),

      updateUser: (userData) =>
        set((state) => ({ user: { ...state.user, ...userData } })),

      logout: () => 
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
        
      setHasHydrated: (state) => set({ _hasHydrated: state })
    }),
    {
      name: 'auth-storage', // name of the item in storage (localStorage by default)
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
