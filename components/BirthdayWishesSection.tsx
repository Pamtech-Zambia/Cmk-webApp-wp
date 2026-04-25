'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Wish {
  id: string
  sender_name: string
  sender_email?: string
  message: string
  created_at: string
}

export default function BirthdayWishesSection() {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [senderName, setSenderName] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const fetchWishes = async () => {
      try {
        const res = await fetch('/api/messages')
        if (res.ok) {
          const data = await res.json()
          setWishes(data || [])
        }
      } catch (error) {
        console.error('Error fetching wishes:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchWishes()
  }, [])

  const handleSubmitWish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!senderName || !newMessage) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: senderName,
          email: senderEmail,
          message: newMessage,
        }),
      })

      if (res.ok) {
        const newWish = await res.json()
        setWishes([newWish, ...wishes])
        setSenderName('')
        setSenderEmail('')
        setNewMessage('')
        setSuccessMessage('Your wish has been shared! 💖')
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error submitting wish:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-pink-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 bg-clip-text text-transparent">
            Birthday Love & Wishes
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            Share your heartfelt wishes for Chimwemwe on this special day
          </p>
          <Link
            href="/wishes"
            className="inline-block px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-full font-semibold hover:shadow-lg transition-all"
          >
            View All Wishes →
          </Link>
        </div>

        {/* Wishes Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border-2 border-pink-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">💝 Share Your Wish</h3>

          <form onSubmit={handleSubmitWish} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your name"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
              />
              <input
                type="email"
                placeholder="Your email (optional)"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>

            <textarea
              placeholder="Your birthday wish for Chimwemwe..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 transition-colors resize-none"
            />

            <button
              type="submit"
              disabled={isSubmitting || !senderName || !newMessage}
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? 'Sending...' : 'Send Wish 💖'}
            </button>

            {successMessage && (
              <p className="text-green-600 font-semibold">{successMessage}</p>
            )}
          </form>
        </div>

        {/* Recent Wishes */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">✨ Recent Wishes</h3>

          {isLoading ? (
            <p className="text-center text-gray-600">Loading wishes...</p>
          ) : wishes.length === 0 ? (
            <p className="text-center text-gray-600">No wishes yet. Be the first to share!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {wishes.slice(0, 4).map((wish) => (
                <div
                  key={wish.id}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-pink-400"
                >
                  <p className="font-bold text-lg text-pink-600 mb-2">{wish.sender_name}</p>
                  <p className="text-gray-700 mb-3">{wish.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(wish.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          {wishes.length > 4 && (
            <div className="text-center mt-8">
              <Link
                href="/wishes"
                className="px-6 py-3 bg-white border-2 border-pink-500 text-pink-600 rounded-full font-semibold hover:bg-pink-50 transition-all"
              >
                See All {wishes.length} Wishes
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
