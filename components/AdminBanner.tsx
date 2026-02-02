'use client'

import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function AdminBanner() {
  const { isAdmin } = useAuthStore()
  const pathname = usePathname()

  // Mostra il banner solo nelle pagine admin quando si è loggati come admin
  if (!isAdmin || !pathname?.startsWith('/admin')) return null

  return (
    <div className="liquid-glass-red text-white text-center py-2 px-4 fixed top-0 left-0 right-0 z-50">
      <span className="font-semibold">ADMIN</span>
    </div>
  )
}
