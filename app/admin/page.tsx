'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase'
import NavigationBar from '@/components/NavigationBar'
import AdminBanner from '@/components/AdminBanner'
import { FiLogOut, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi'

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

export default function AdminPage() {
  const { isAdmin, logout } = useAuthStore()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'products' | 'hero' | 'sponsors'>('products')

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin/login')
      return
    }
    loadProducts()
  }, [isAdmin, router])

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo prodotto?')) return

    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      loadProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Errore durante l\'eliminazione')
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-red-50">
      <AdminBanner />
      
      <main className="pb-24 pt-12 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Pannello Admin</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            <FiLogOut size={20} />
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-2 rounded-lg font-semibold ${
              activeTab === 'products'
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            Prodotti
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`flex-1 py-2 rounded-lg font-semibold ${
              activeTab === 'hero'
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            Hero
          </button>
          <button
            onClick={() => setActiveTab('sponsors')}
            className={`flex-1 py-2 rounded-lg font-semibold ${
              activeTab === 'sponsors'
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            Sponsor
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <button
              onClick={() => router.push('/admin/products/new')}
              className="mb-4 w-full py-3 bg-red-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <FiPlus size={20} />
              Nuovo Prodotto
            </button>

            {loading ? (
              <div className="text-center py-8">Caricamento...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nessun prodotto. Crea il primo!
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="liquid-glass rounded-2xl p-4 flex gap-4"
                  >
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-pink-200 to-pink-300">
                      {product.images && product.images.length > 0 && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          <span>No img</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{product.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      <p className="text-lg font-bold text-red-600">
                        €{product.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => router.push(`/admin/products/${product.id}`)}
                        className="p-2 bg-blue-500 text-white rounded-lg"
                      >
                        <FiEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 bg-red-600 text-white rounded-lg"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Hero Tab */}
        {activeTab === 'hero' && (
          <div>
            <HeroImageManager />
          </div>
        )}

        {/* Sponsors Tab */}
        {activeTab === 'sponsors' && (
          <div>
            <SponsorImageManager />
          </div>
        )}
      </main>

      <NavigationBar />
    </div>
  )
}

function HeroImageManager() {
  const [heroImage, setHeroImage] = useState<string>('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadHeroImage()
  }, [])

  const loadHeroImage = async () => {
    try {
      const { data } = await supabase
        .from('hero_image')
        .select('image_url')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      if (data?.image_url) {
        setHeroImage(data.image_url)
      }
    } catch (error) {
      console.error('Error loading hero image:', error)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // For now, we'll use a data URL or you can implement Supabase Storage
      // First, create the storage bucket in Supabase Dashboard if not exists
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64data = reader.result as string
        
        // Option 1: Store as base64 in database (simple but not recommended for production)
        // Option 2: Upload to Supabase Storage (recommended)
        try {
          const fileExt = file.name.split('.').pop()
          const fileName = `hero-${Date.now()}.${fileExt}`
          const filePath = `hero/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            })

          if (uploadError) {
            // Fallback to base64 if storage fails
            const { error: dbError } = await supabase
              .from('hero_image')
              .insert({ image_url: base64data })
            
            if (dbError) throw dbError
            setHeroImage(base64data)
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('images')
              .getPublicUrl(filePath)

            const { error: dbError } = await supabase
              .from('hero_image')
              .insert({ image_url: publicUrl })

            if (dbError) throw dbError
            setHeroImage(publicUrl)
          }
          
          alert('Immagine caricata con successo!')
        } catch (error) {
          console.error('Error uploading:', error)
          alert('Errore durante il caricamento. Assicurati che il bucket "images" esista in Supabase Storage.')
        } finally {
          setUploading(false)
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error:', error)
      setUploading(false)
    }
  }

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4">Immagine Hero</h2>
      {heroImage && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
          <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={uploading}
        className="w-full p-2 border-2 border-gray-300 rounded-lg"
      />
      {uploading && <p className="mt-2 text-sm text-gray-600">Caricamento...</p>}
    </div>
  )
}

function SponsorImageManager() {
  const [sponsors, setSponsors] = useState<{ position: number; image_url: string }[]>([])
  const [uploading, setUploading] = useState<number | null>(null)

  useEffect(() => {
    loadSponsors()
  }, [])

  const loadSponsors = async () => {
    try {
      const { data } = await supabase
        .from('sponsor_images')
        .select('position, image_url')
        .order('position', { ascending: true })

      if (data) {
        setSponsors(data)
      }
    } catch (error) {
      console.error('Error loading sponsors:', error)
    }
  }

  const handleFileUpload = async (position: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(position)
    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64data = reader.result as string
        
        try {
          const fileExt = file.name.split('.').pop()
          const fileName = `sponsor${position}-${Date.now()}.${fileExt}`
          const filePath = `sponsors/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            })

          let imageUrl = base64data

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('images')
              .getPublicUrl(filePath)
            imageUrl = publicUrl
          }

          // Delete old image for this position
          await supabase
            .from('sponsor_images')
            .delete()
            .eq('position', position)

          // Insert new image
          const { error: dbError } = await supabase
            .from('sponsor_images')
            .insert({ position, image_url: imageUrl })

          if (dbError) throw dbError

          loadSponsors()
          alert('Immagine caricata con successo!')
        } catch (error) {
          console.error('Error uploading:', error)
          alert('Errore durante il caricamento. Assicurati che il bucket "images" esista in Supabase Storage.')
        } finally {
          setUploading(null)
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error:', error)
      setUploading(null)
    }
  }

  return (
    <div className="space-y-4">
      {[1, 2, 3].map((position) => {
        const sponsor = sponsors.find((s) => s.position === position)
        return (
          <div key={position} className="liquid-glass rounded-2xl p-6">
            <h3 className="font-bold mb-4">Sponsor {position}</h3>
            {sponsor?.image_url && (
              <div className="relative w-full h-32 rounded-lg overflow-hidden mb-4">
                <img
                  src={sponsor.image_url}
                  alt={`Sponsor ${position}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(position, e)}
              disabled={uploading === position}
              className="w-full p-2 border-2 border-gray-300 rounded-lg"
            />
            {uploading === position && (
              <p className="mt-2 text-sm text-gray-600">Caricamento...</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
