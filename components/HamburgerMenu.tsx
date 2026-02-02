'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi'
import { useAuthStore } from '@/store/authStore'

interface MenuItem {
  label: string
  href?: string
  submenu?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    label: 'Nuovi Arrivi',
    href: '/category/nuovi-arrivi',
  },
  {
    label: 'Abbigliamento',
    submenu: [
      { label: 'Abiti/Coordinati', href: '/category/abiti-coordinati' },
      { label: 'Blazer/Trench/Cappotti', href: '/category/blazer-trench-cappotti' },
      { label: 'Camicie/Tshirt/Top', href: '/category/camicie-tshirt-top' },
      { label: 'Pantaloncini/Gonne', href: '/category/pantaloncini-gonne' },
      { label: 'Pantaloni/Jeans', href: '/category/pantaloni-jeans' },
      { label: 'Tute', href: '/category/tute' },
    ],
  },
]

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const { isAdmin } = useAuthStore()
  const pathname = usePathname()
  
  // Non mostrare il menu nelle pagine admin
  useEffect(() => {
    if (pathname?.startsWith('/admin')) {
      setIsOpen(false)
    }
  }, [pathname])
  
  // Nascondi completamente il menu nelle pagine admin
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setOpenSubmenu(null)
    }
  }

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label)
  }

  const handleLinkClick = () => {
    setIsOpen(false)
    setOpenSubmenu(null)
  }

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className={`fixed top-4 right-4 z-50 p-3 rounded-full liquid-glass ${
          isAdmin ? 'bg-red-500/20' : 'bg-pink-500/20'
        }`}
        aria-label="Menu"
      >
        {isOpen ? (
          <FiX size={24} className={isAdmin ? 'text-red-900' : 'text-pink-900'} />
        ) : (
          <FiMenu size={24} className={isAdmin ? 'text-red-900' : 'text-pink-900'} />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleMenu}
        />
      )}

      {/* Menu Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] liquid-glass z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } ${isAdmin ? 'bg-red-50/95' : 'bg-pink-50/95'}`}
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Menu</h2>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-white/50"
            >
              <FiX size={24} />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.label)}
                      className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-white/50 transition-colors text-left"
                    >
                      <span className="font-semibold text-gray-800">{item.label}</span>
                      <FiChevronDown
                        className={`transition-transform ${
                          openSubmenu === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openSubmenu === item.label && (
                      <div className="ml-4 mt-2 space-y-1">
                        {item.submenu.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href || '#'}
                            onClick={handleLinkClick}
                            className="block p-3 rounded-lg hover:bg-white/50 transition-colors text-gray-700"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href || '#'}
                    onClick={handleLinkClick}
                    className="block p-4 rounded-lg hover:bg-white/50 transition-colors font-semibold text-gray-800"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}
