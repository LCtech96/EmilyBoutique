'use client'

import NavigationBar from '@/components/NavigationBar'
import AdminBanner from '@/components/AdminBanner'
import { useAuthStore } from '@/store/authStore'
import { FiMapPin } from 'react-icons/fi'

export default function MapsPage() {
  const { isAdmin } = useAuthStore()
  const mapUrl = 'https://maps.app.goo.gl/wXRVdW3oGvSFnTj37'

  return (
    <div className={`min-h-screen ${isAdmin ? 'bg-red-50' : 'bg-gradient-to-b from-pink-50 to-pink-100'}`}>
      <AdminBanner />
      
      <main className="pb-24 pt-12 px-4">
        <h1 className="text-3xl font-bold mb-6">La Nostra Posizione</h1>

        <div className="liquid-glass rounded-2xl p-6 mb-6">
          <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-4 bg-gray-200">
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Mappa interattiva</p>
                <p className="text-sm text-gray-500">Clicca su "Vieni a Trovarci" per aprire la posizione</p>
              </div>
            </div>
          </div>

          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 ${
              isAdmin ? 'bg-red-500' : 'bg-pink-500'
            }`}
          >
            <FiMapPin size={20} />
            Vieni a Trovarci
          </a>
        </div>
      </main>

      <NavigationBar />
    </div>
  )
}
