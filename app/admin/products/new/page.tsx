'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase'
import NavigationBar from '@/components/NavigationBar'
import AdminBanner from '@/components/AdminBanner'
import { FiArrowLeft, FiX } from 'react-icons/fi'

export default function NewProductPage() {
  const { isAdmin } = useAuthStore()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [sizes, setSizes] = useState<string[]>([])
  const [colors, setColors] = useState<string[]>([])
  const [sizeInput, setSizeInput] = useState('')
  const [colorInput, setColorInput] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin/login')
    }
  }, [isAdmin, router])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `products/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath)

        return publicUrl
      })

      const urls = await Promise.all(uploadPromises)
      setImages([...images, ...urls])
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Errore durante il caricamento delle immagini')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const addSize = () => {
    if (sizeInput.trim() && !sizes.includes(sizeInput.trim())) {
      setSizes([...sizes, sizeInput.trim()])
      setSizeInput('')
    }
  }

  const removeSize = (size: string) => {
    setSizes(sizes.filter((s) => s !== size))
  }

  const addColor = () => {
    if (colorInput.trim() && !colors.includes(colorInput.trim())) {
      setColors([...colors, colorInput.trim()])
      setColorInput('')
    }
  }

  const removeColor = (color: string) => {
    setColors(colors.filter((c) => c !== color))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !price || images.length === 0) {
      alert('Compila tutti i campi obbligatori')
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase.from('products').insert({
        title,
        description,
        price: parseFloat(price),
        images,
        sizes,
        colors,
      })

      if (error) throw error

      router.push('/admin')
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Errore durante il salvataggio')
    } finally {
      setSaving(false)
    }
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-red-50">
      <AdminBanner />
      
      <main className="pb-24 pt-12 px-4">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-red-600"
        >
          <FiArrowLeft size={20} />
          Indietro
        </button>

        <h1 className="text-3xl font-bold mb-6">Nuovo Prodotto</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-2">Titolo *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Descrizione</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-300"
              rows={4}
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Prezzo (€) *</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Immagini *</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full p-2 border-2 border-gray-300 rounded-lg"
            />
            {uploading && <p className="mt-2 text-sm text-gray-600">Caricamento...</p>}
            
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {images.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-2">Taglie</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300"
                placeholder="Es: S, M, L"
              />
              <button
                type="button"
                onClick={addSize}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Aggiungi
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <span
                  key={size}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-full flex items-center gap-2"
                >
                  {size}
                  <button
                    type="button"
                    onClick={() => removeSize(size)}
                    className="text-red-700"
                  >
                    <FiX size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Colori</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300"
                placeholder="Es: Rosso, Blu"
              />
              <button
                type="button"
                onClick={addColor}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Aggiungi
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <span
                  key={color}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-full flex items-center gap-2"
                >
                  {color}
                  <button
                    type="button"
                    onClick={() => removeColor(color)}
                    className="text-red-700"
                  >
                    <FiX size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-red-500 text-white rounded-lg font-semibold disabled:opacity-50"
          >
            {saving ? 'Salvataggio...' : 'Salva Prodotto'}
          </button>
        </form>
      </main>

      <NavigationBar />
    </div>
  )
}
