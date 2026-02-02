'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { supabase } from '@/lib/supabase'
import { useCartStore } from '@/store/cartStore'
import NavigationBar from '@/components/NavigationBar'
import AdminBanner from '@/components/AdminBanner'
import { useAuthStore } from '@/store/authStore'
import { FiShoppingCart, FiArrowLeft } from 'react-icons/fi'

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

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const { addItem } = useCartStore()
  const { isAdmin } = useAuthStore()

  useEffect(() => {
    if (id) {
      loadProduct(id as string)
    }
  }, [id])

  const loadProduct = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (error) throw error

      if (data) {
        setProduct(data)
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0])
        }
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0])
        }
      }
    } catch (error) {
      console.error('Error loading product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0] || '/placeholder.jpg',
      quantity,
      selectedSize: selectedSize || undefined,
      selectedColor: selectedColor || undefined,
    })

    router.push('/cart')
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${isAdmin ? 'bg-red-50' : 'bg-gradient-to-b from-pink-50 to-pink-100'}`}>
        <AdminBanner />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">Caricamento...</div>
        </div>
        <NavigationBar />
      </div>
    )
  }

  if (!product) {
    return (
      <div className={`min-h-screen ${isAdmin ? 'bg-red-50' : 'bg-gradient-to-b from-pink-50 to-pink-100'}`}>
        <AdminBanner />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="mb-4">Prodotto non trovato</p>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg"
            >
              Torna alla Home
            </button>
          </div>
        </div>
        <NavigationBar />
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isAdmin ? 'bg-red-50' : 'bg-gradient-to-b from-pink-50 to-pink-100'}`}>
      <AdminBanner />
      
      <main className="pb-24">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-16 left-4 z-10 p-2 liquid-glass rounded-full"
        >
          <FiArrowLeft size={24} />
        </button>

        {/* Image Gallery */}
        <div className="w-full h-96 md:h-[500px] relative">
          {product.images.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              className="w-full h-full"
            >
              {product.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <Image
                    src={image}
                    alt={`${product.title} - ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized={image.startsWith('data:') || image.includes('supabase.co')}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Nessuna immagine</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-2xl font-bold text-pink-600 mb-4">€{product.price.toFixed(2)}</p>
          
          {product.description && (
            <p className="text-gray-700 mb-6">{product.description}</p>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Taglia</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedSize === size
                        ? isAdmin
                          ? 'bg-red-500 text-white border-red-500'
                          : 'bg-pink-500 text-white border-pink-500'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Colore</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedColor === color
                        ? isAdmin
                          ? 'bg-red-500 text-white border-red-500'
                          : 'bg-pink-500 text-white border-pink-500'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Quantità</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center"
              >
                -
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 ${
              isAdmin ? 'bg-red-500' : 'bg-pink-500'
            }`}
          >
            <FiShoppingCart size={20} />
            Aggiungi al Carrello
          </button>
        </div>
      </main>

      <NavigationBar />
    </div>
  )
}
