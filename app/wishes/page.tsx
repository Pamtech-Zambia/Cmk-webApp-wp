'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'

interface Message {
  id: string
  sender_name: string
  sender_email?: string
  message: string
  created_at?: string
}

// Default wishes from the developer
const DEFAULT_WISHES: Message[] = [
  {
    id: 'dev-1',
    sender_name: 'The CMK Team',
    message: 'Happy Birthday Chimwemwe! 🎉 This website is our gift to celebrate you and everything you represent. Thank you for bringing so much joy and love to everyone around you. 💖',
    created_at: new Date().toISOString(),
  },
  {
    id: 'dev-2',
    sender_name: 'From Your Loved Ones',
    message: 'Chimwemwe - your name means happiness, and you truly live up to it every single day. May your birthday be filled with the same sweetness and warmth you bring to the world. 💝',
    created_at: new Date().toISOString(),
  },
  {
    id: 'dev-3',
    sender_name: 'CMK Baking Community',
    message: 'Here\'s to another year of amazing bakes, beautiful smiles, and spreading happiness! You deserve all the love, joy, and celebration. April 25th is your day! ✨',
    created_at: new Date().toISOString(),
  },
]

export default function WishesPage() {
  const [messages, setMessages] = useState<Message[]>(DEFAULT_WISHES)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Load messages from API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages')
        if (response.ok) {
          const data = await response.json()
          // Combine default wishes with fetched messages
          setMessages([...DEFAULT_WISHES, ...data])
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newName.trim() || !newMessage.trim()) {
      setSubmitStatus('Please fill in your name and message')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('')

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          email: newEmail.trim(),
          message: newMessage.trim(),
        }),
      })

      if (response.ok) {
        const newMsg = await response.json()
        setMessages([...newMsg, ...messages])
        setNewName('')
        setNewEmail('')
        setNewMessage('')
        setSubmitStatus('✨ Your birthday wish has been added!')
        setTimeout(() => setSubmitStatus(''), 3000)
      } else {
        setSubmitStatus('Failed to add wish. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      setSubmitStatus('Error submitting wish. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 md:ml-64">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-orange-400 text-white pt-20 pb-12 px-4 md:pt-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">💝 Birthday Wishes for Chimwemwe</h1>
            <p className="text-lg opacity-90">
              Share your love, appreciation, and birthday wishes on this special day!
            </p>
          </div>
        </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Submit Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-12 border-2 border-pink-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Share Your Birthday Wish</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={isSubmitting}
                className="px-4 py-3 rounded-lg border-2 border-pink-200 focus:border-pink-500 focus:outline-none transition-colors disabled:bg-gray-100"
              />
              <input
                type="email"
                placeholder="Your email (optional)"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={isSubmitting}
                className="px-4 py-3 rounded-lg border-2 border-pink-200 focus:border-pink-500 focus:outline-none transition-colors disabled:bg-gray-100"
              />
            </div>
            <textarea
              placeholder="Write your birthday wish for Chimwemwe..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={isSubmitting}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border-2 border-pink-200 focus:border-pink-500 focus:outline-none transition-colors disabled:bg-gray-100 resize-none"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Wish'}
            </button>
          </form>

          {submitStatus && (
            <div className={`mt-4 p-4 rounded-lg text-center font-semibold ${
              submitStatus.includes('✨')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {submitStatus}
            </div>
          )}
        </div>

        {/* Messages Display */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            {isLoading ? 'Loading wishes...' : `Birthday Wishes (${messages.length})`}
          </h2>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading birthday wishes...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <p className="text-gray-600 text-lg">No wishes yet. Be the first to share one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {messages.map((msg, idx) => (
                <div
                  key={msg.id || idx}
                  className={`rounded-2xl p-6 shadow-lg border-2 transition-all hover:shadow-xl ${
                    msg.id?.startsWith('dev-')
                      ? 'bg-gradient-to-br from-pink-100 to-orange-100 border-pink-300'
                      : 'bg-white border-pink-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{msg.sender_name}</h3>
                      {msg.id?.startsWith('dev-') && (
                        <p className="text-xs text-pink-600 font-semibold">Official Message</p>
                      )}
                    </div>
                    {msg.id?.startsWith('dev-') && (
                      <span className="text-2xl">💝</span>
                    )}
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-4">{msg.message}</p>

                  {msg.created_at && (
                    <p className="text-xs text-gray-500">
                      {new Date(msg.created_at).toLocaleDateString([], {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white mt-16 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg font-semibold mb-2">Chimwemwe's Happy Bakes</p>
          <p className="opacity-90 mb-2">Celebrating happiness one wish at a time</p>
          <p className="text-sm opacity-75">
            Birthday: April 25th | WhatsApp: +260 974 619 781
          </p>
        </div>
      </footer>
    </div>
  )
}
