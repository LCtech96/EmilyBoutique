'use client'

import NavigationBar from '@/components/NavigationBar'
import AdminBanner from '@/components/AdminBanner'
import { useAuthStore } from '@/store/authStore'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

export default function ContactPage() {
  const { isAdmin } = useAuthStore()

  return (
    <div className={`min-h-screen ${isAdmin ? 'bg-red-50' : 'bg-gradient-to-b from-pink-50 to-pink-100'}`}>
      <AdminBanner />
      
      <main className="pb-24 pt-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Contatti</h1>
        
        <div className="space-y-4">
          <div className="liquid-glass rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <FiMail size={24} className={isAdmin ? 'text-red-600' : 'text-pink-600'} />
              <div>
                <h3 className="font-semibold">Email</h3>
                <a href="mailto:emilyboutique@arubapec.it" className="text-gray-700">
                  emilyboutique@arubapec.it
                </a>
              </div>
            </div>
          </div>

          <div className="liquid-glass rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <FiPhone size={24} className={isAdmin ? 'text-red-600' : 'text-pink-600'} />
              <div>
                <h3 className="font-semibold">Telefono / WhatsApp</h3>
                <a href="https://wa.me/393500756681" className="text-gray-700">
                  +39 350 075 6681
                </a>
              </div>
            </div>
          </div>

          <div className="liquid-glass rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <FiMapPin size={24} className={isAdmin ? 'text-red-600' : 'text-pink-600'} />
              <div>
                <h3 className="font-semibold">Indirizzo</h3>
                <a
                  href="https://maps.app.goo.gl/wXRVdW3oGvSFnTj37"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700"
                >
                  Vieni a trovarci
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <NavigationBar />
    </div>
  )
}
