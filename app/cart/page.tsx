'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import NavigationBar from '@/components/NavigationBar'
import AdminBanner from '@/components/AdminBanner'
import { useAuthStore } from '@/store/authStore'
import { FiTrash2, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi'

export default function CartPage() {
  const { items, updateQuantity, removeItem, updateItem, getTotal, clearCart } = useCartStore()
  const { isAdmin } = useAuthStore()
  const router = useRouter()
  const [showCheckout, setShowCheckout] = useState(false)
  const [shippingMethod, setShippingMethod] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  const handleCheckout = () => {
    if (items.length === 0) return
    setShowCheckout(true)
  }

  const handleCompleteOrder = async () => {
    if (!shippingMethod || !paymentMethod) {
      alert('Seleziona metodo di spedizione e pagamento')
      return
    }

    // Here you would typically send the order to your backend
    // For now, we'll just show a success message
    alert('Ordine completato! Grazie per il tuo acquisto.')
    clearCart()
    setShowCheckout(false)
    router.push('/')
  }

  if (showCheckout) {
    return (
      <div className={`min-h-screen ${isAdmin ? 'bg-red-50' : 'bg-gradient-to-b from-pink-50 to-pink-100'}`}>
        <AdminBanner />
        
        <main className="pb-24 pt-12 px-4">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>

          {/* Shipping Method */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Metodo di Spedizione</h2>
            <div className="space-y-2">
              {['DHL', 'FedEx', 'UPS'].map((method) => (
                <button
                  key={method}
                  onClick={() => setShippingMethod(method)}
                  className={`w-full p-4 rounded-lg border-2 text-left ${
                    shippingMethod === method
                      ? isAdmin
                        ? 'border-red-500 bg-red-50'
                        : 'border-pink-500 bg-pink-50'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Metodo di Pagamento</h2>
            <div className="space-y-2">
              {['QR Code', 'Visa', 'Mastercard', 'PayPal'].map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`w-full p-4 rounded-lg border-2 text-left ${
                    paymentMethod === method
                      ? isAdmin
                        ? 'border-red-500 bg-red-50'
                        : 'border-pink-500 bg-pink-50'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* QR Code placeholder */}
          {paymentMethod === 'QR Code' && (
            <div className="mb-6 p-4 liquid-glass rounded-lg text-center">
              <p className="mb-2">Scansiona il QR Code per pagare</p>
              <div className="w-48 h-48 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">QR Code</span>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="mb-6 p-4 liquid-glass rounded-lg">
            <div className="flex justify-between text-xl font-bold">
              <span>Totale:</span>
              <span>€{getTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Complete Order Button */}
          <button
            onClick={handleCompleteOrder}
            className={`w-full py-4 rounded-2xl font-semibold text-white ${
              isAdmin ? 'bg-red-500' : 'bg-pink-500'
            }`}
          >
            Completa Ordine
          </button>

          <button
            onClick={() => setShowCheckout(false)}
            className="w-full py-4 mt-4 rounded-2xl font-semibold border-2 border-gray-300"
          >
            Indietro
          </button>
        </main>

        <NavigationBar />
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isAdmin ? 'bg-red-50' : 'bg-gradient-to-b from-pink-50 to-pink-100'}`}>
      <AdminBanner />
      
      <main className="pb-24 pt-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Carrello</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Il tuo carrello è vuoto</p>
            <button
              onClick={() => router.push('/')}
              className={`px-6 py-3 rounded-lg font-semibold text-white ${
                isAdmin ? 'bg-red-500' : 'bg-pink-500'
              }`}
            >
              Continua lo Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="liquid-glass rounded-2xl p-4 flex gap-4"
                >
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-pink-200 to-pink-300">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        unoptimized={item.image.startsWith('data:') || item.image.includes('supabase.co')}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        <span>Img</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    {item.selectedSize && (
                      <p className="text-sm text-gray-600">Taglia: {item.selectedSize}</p>
                    )}
                    {item.selectedColor && (
                      <p className="text-sm text-gray-600">Colore: {item.selectedColor}</p>
                    )}
                    <p className="text-lg font-bold text-pink-600 mt-2">
                      €{(item.price * item.quantity).toFixed(2)}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center"
                      >
                        <FiMinus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center"
                      >
                        <FiPlus size={16} />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto p-2 text-red-500"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="liquid-glass rounded-2xl p-6 mb-4">
              <div className="flex justify-between text-2xl font-bold mb-4">
                <span>Totale:</span>
                <span>€{getTotal().toFixed(2)}</span>
              </div>
              
              <button
                onClick={handleCheckout}
                className={`w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 ${
                  isAdmin ? 'bg-red-500' : 'bg-pink-500'
                }`}
              >
                Procedi al Checkout
                <FiArrowRight size={20} />
              </button>
            </div>
          </>
        )}
      </main>

      <NavigationBar />
    </div>
  )
}
