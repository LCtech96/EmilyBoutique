'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import NavigationBar from '@/components/NavigationBar'
import AdminBanner from '@/components/AdminBanner'
import { useAuthStore } from '@/store/authStore'

interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  sizes: string[]
  colors: string[]
  category?: string
}

export default function Home() {
  const [heroImage, setHeroImage] = useState<string>('/hero.jpg')
  const [sponsors, setSponsors] = useState<string[]>(['/sponsor1.jpg', '/sponsor2.jpg', '/sponsor3.jpg'])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { isAdmin } = useAuthStore()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load hero image
      try {
        const { data: heroData, error: heroError } = await supabase
          .from('hero_image')
          .select('image_url')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (!heroError && heroData?.image_url) {
          setHeroImage(heroData.image_url)
        }
      } catch (error) {
        console.log('Hero image table may not exist yet')
      }

      // Load sponsor images
      try {
        const { data: sponsorData, error: sponsorError } = await supabase
          .from('sponsor_images')
          .select('image_url, position')
          .order('position', { ascending: true })

        if (!sponsorError && sponsorData && sponsorData.length > 0) {
          const sortedSponsors = sponsorData.sort((a, b) => a.position - b.position)
          setSponsors(sortedSponsors.map(s => s.image_url))
        }
      } catch (error) {
        console.log('Sponsor images table may not exist yet')
      }

      // Load products
      try {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })

        if (!productsError && productsData) {
          setProducts(productsData)
        }
      } catch (error) {
        console.log('Products table may not exist yet')
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${isAdmin ? 'bg-red-50' : 'bg-gradient-to-b from-pink-50 to-pink-100'}`}>
      <AdminBanner />
      
      <main className="pb-24 pt-12">
        {isAdmin && (
          <div className="px-4 mb-4">
            <Link
              href="/admin"
              className="inline-block px-4 py-2 bg-red-500 text-white rounded-lg font-semibold"
            >
              Pannello Admin
            </Link>
          </div>
        )}
        
        {/* Hero Image */}
        <div className="relative w-full h-64 md:h-96 mb-6 bg-gradient-to-br from-pink-200 to-pink-300 rounded-2xl overflow-hidden">
          {heroImage && heroImage !== '/hero.jpg' ? (
            <Image
              src={heroImage}
              alt="Hero"
              fill
              className="object-cover"
              priority
              unoptimized={heroImage.startsWith('data:') || heroImage.includes('supabase.co')}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <span>Immagine Hero</span>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">EMILY BOUTIQUE</h1>
        </div>

        {/* Sponsor Cards */}
        <div className="flex gap-4 px-4 mb-8 overflow-x-auto">
          {sponsors.map((sponsor, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden liquid-glass bg-gradient-to-br from-pink-200 to-pink-300"
            >
              {sponsor && !sponsor.includes('sponsor') && !sponsor.includes('.jpg') ? (
                <Image
                  src={sponsor}
                  alt={`Sponsor ${index + 1}`}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  unoptimized={sponsor.startsWith('data:') || sponsor.includes('supabase.co')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                  <span>Sponsor {index + 1}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Products Grid */}
        <div className="px-4 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">I Nostri Prodotti</h2>
          {loading ? (
            <div className="text-center py-8">Caricamento...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nessun prodotto disponibile
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="liquid-glass rounded-2xl overflow-hidden transition-transform hover:scale-105"
                >
                  <div className="relative w-full h-48 md:h-64 bg-gradient-to-br from-pink-200 to-pink-300">
                    {product.images && product.images.length > 0 && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                        unoptimized={product.images[0].startsWith('data:') || product.images[0].includes('supabase.co')}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                        <span>Nessuna immagine</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.title}</h3>
                    <p className="text-lg font-bold text-pink-600">€{product.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="px-4 py-8 mt-12 liquid-glass rounded-t-3xl">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">Link Brevi</h3>
              <div className="flex flex-wrap gap-4">
                <Link href="/about" className="text-gray-700 hover:text-pink-600">About</Link>
                <Link href="/contact" className="text-gray-700 hover:text-pink-600">Contact</Link>
                <a
                  href="https://wa.me/393500756681"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-pink-600"
                >
                  WhatsApp
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-3">Per Lei</h3>
              <div className="flex flex-wrap gap-4">
                <Link href="/category/accessori-donna" className="text-gray-700 hover:text-pink-600">
                  Accessori Donna
                </Link>
                <Link href="/category/jeans-donna" className="text-gray-700 hover:text-pink-600">
                  Jeans Donna
                </Link>
                <Link href="/category/giacche-donna" className="text-gray-700 hover:text-pink-600">
                  Giacche Donna
                </Link>
                <Link href="/category/pantaloncini-donna" className="text-gray-700 hover:text-pink-600">
                  Pantaloncini Donna
                </Link>
                <Link href="/category/gonne-donna" className="text-gray-700 hover:text-pink-600">
                  Gonne Donna
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <NavigationBar />
    </div>
  )
}
