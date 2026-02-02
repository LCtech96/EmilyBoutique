'use client'

import NavigationBar from '@/components/NavigationBar'
import HamburgerMenu from '@/components/HamburgerMenu'
import { FiMapPin } from 'react-icons/fi'

export default function MapsPage() {
  const mapUrl = 'https://maps.app.goo.gl/wXRVdW3oGvSFnTj37'

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100">
      <HamburgerMenu />
      
      <main className="pb-24 pt-12 px-4">
        <h1 className="text-3xl font-bold mb-6">La Nostra Posizione</h1>

        <div className="liquid-glass rounded-2xl p-6 mb-6">
          <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-4 bg-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841333890297!2d-73.98808568459418!3d40.75889597932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sit!2sit!4v1234567890123!5m2!1sit!2sit"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full rounded-xl"
            />
          </div>

          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 bg-pink-500"
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
