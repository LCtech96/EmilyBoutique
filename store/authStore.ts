import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { adminEmail, adminPassword } from '@/lib/supabase'

interface AuthStore {
  isAdmin: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAdmin: false,
      login: (email, password) => {
        if (email === adminEmail && password === adminPassword) {
          set({ isAdmin: true })
          return true
        }
        return false
      },
      logout: () => set({ isAdmin: false }),
    }),
    {
      name: 'emily-boutique-auth',
      storage: typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined,
    }
  )
)
