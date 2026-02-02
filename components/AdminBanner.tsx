'use client'

import { useAuthStore } from '@/store/authStore'

export default function AdminBanner() {
  const { isAdmin } = useAuthStore()

  if (!isAdmin) return null

  return (
    <div className="liquid-glass-red text-white text-center py-2 px-4 fixed top-0 left-0 right-0 z-50">
      <span className="font-semibold">ADMIN</span>
    </div>
  )
}
