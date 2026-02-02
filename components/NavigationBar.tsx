'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiHome, FiShoppingCart, FiMap } from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

export default function NavigationBar() {
  const pathname = usePathname()
  const { items } = useCartStore()
  const { isAdmin } = useAuthStore()
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
  
  // Determina se siamo nell'area admin basandoci sul pathname
  const isAdminArea = pathname?.startsWith('/admin')

  const navItems = [
    { href: '/', icon: FiHome, label: 'Home' },
    { href: '/cart', icon: FiShoppingCart, label: 'Carrello', badge: cartCount },
    { href: '/maps', icon: FiMap, label: 'Maps' },
  ]

  return (
    <nav className={`ios-nav-bar ${isAdminArea && isAdmin ? 'admin' : ''}`}>
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? isAdminArea && isAdmin
                    ? 'text-white bg-red-600/30'
                    : 'text-pink-600 bg-pink-200/50'
                  : isAdminArea && isAdmin
                  ? 'text-red-900'
                  : 'text-gray-700'
              }`}
            >
              <div className="relative">
                <Icon size={24} />
                {item.badge && item.badge > 0 && (
                  <span
                    className={`absolute -top-2 -right-2 min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold flex items-center justify-center ${
                      isAdminArea && isAdmin
                        ? 'bg-white text-red-600'
                        : 'bg-pink-500 text-white'
                    }`}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
