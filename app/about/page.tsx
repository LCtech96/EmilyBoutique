'use client'

import NavigationBar from '@/components/NavigationBar'
import AdminBanner from '@/components/AdminBanner'
import { useAuthStore } from '@/store/authStore'

export default function AboutPage() {
  const { isAdmin } = useAuthStore()

  return (
    <div className={`min-h-screen ${isAdmin ? 'bg-red-50' : 'bg-gradient-to-b from-pink-50 to-pink-100'}`}>
      <AdminBanner />
      
      <main className="pb-24 pt-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Chi Siamo</h1>
        
        <div className="liquid-glass rounded-2xl p-6">
          <p className="text-gray-700 mb-4">
            Benvenuti da Emily Boutique, il vostro negozio di moda preferito!
          </p>
          <p className="text-gray-700 mb-4">
            Siamo specializzati in abbigliamento femminile di alta qualità, 
            offrendo una vasta gamma di capi d'abbigliamento che vanno dagli 
            accessori ai jeans, dalle giacche ai pantaloncini e alle gonne.
          </p>
          <p className="text-gray-700">
            La nostra missione è aiutare ogni donna a esprimere il proprio stile 
            unico attraverso capi di moda eleganti e alla moda.
          </p>
        </div>
      </main>

      <NavigationBar />
    </div>
  )
}
