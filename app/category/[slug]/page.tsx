'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
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

const categoryMap: Record<string, string> = {
  'accessori-donna': 'Accessori Donna',
  'jeans-donna': 'Jeans Donna',
  'giacche-donna': 'Giacche Donna',
  'pantaloncini-donna': 'Pantaloncini Donna',
  'gonne-donna': 'Gonne Donna',
}

export default function CategoryPage() {
  const params = useParams()
  const { slug } = params
  const { isAdmin } = useAuthStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      loadProducts(slug as string)
    }
  }, [slug])

  const loadProducts = async (categorySlug: string) => {
    try {
      const categoryName = categoryMap[categorySlug] || categorySlug
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('category', `%${categoryName}%`)
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const categoryName = categoryMap[slug as string] || slug

  return (
    <div className={`min-h-screen ${isAdmin ? 'bg-red-50' : 'bg-gradient-to-b from-pink-50 to-pink-100'}`}>
      <AdminBanner />
      
      <main className="pb-24 pt-12 px-4">
        <h1 className="text-3xl font-bold mb-6">{categoryName}</h1>

        {loading ? (
          <div className="text-center py-8">Caricamento...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nessun prodotto disponibile in questa categoria
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="liquid-glass rounded-2xl overflow-hidden transition-transform hover:scale-105"
              >
                <div className="relative w-full h-48 md:h-64">
                  <Image
                    src={product.images[0] || '/placeholder.jpg'}
                    alt={product.title}
                    fill
                    className="object-cover"
                    onError={() => {}}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.title}</h3>
                  <p className="text-lg font-bold text-pink-600">€{product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <NavigationBar />
    </div>
  )
}
