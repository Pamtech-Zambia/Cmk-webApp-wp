'use client'

import { useEffect, useState } from 'react'

interface Message {
  id: string
  sender_name: string
  message: string
  created_at?: string
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Load existing messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages')
        if (response.ok) {
          const data = await response.json()
          setMessages(data)
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

    if (!name.trim() || !message.trim()) {
      setSubmitMessage('❌ Please fill in both fields')
      return
    }

    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      })

      if (response.ok) {
        const newMessage = await response.json()
        setMessages([...newMessage, ...messages])
        setName('')
        setMessage('')
        setSubmitMessage('✨ Your message has been saved!')
        setTimeout(() => setSubmitMessage(''), 3000)
      } else {
        setSubmitMessage('❌ Failed to save message. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting message:', error)
      setSubmitMessage('❌ Error submitting message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="messages" className="py-16 px-4 bg-gradient-to-b from-pink-50 to-yellow-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
          Birthday Wishes
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Share your love and appreciation for Chimwemwe
        </p>

        {/* Message Form */}
        <div className="mb-12 bg-white rounded-2xl p-8 shadow-lg border-2 border-pink-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                placeholder="Enter your name..."
                className="w-full px-4 py-3 rounded-lg border-2 border-pink-200 focus:border-pink-500 focus:outline-none transition-colors disabled:bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSubmitting}
                placeholder="Write your birthday wishes here..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border-2 border-pink-200 focus:border-pink-500 focus:outline-none transition-colors disabled:bg-gray-100 resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Send Wishes'}
              </button>
              {submitMessage && (
                <p className="text-lg font-semibold text-pink-600">
                  {submitMessage}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Messages Display */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {isLoading ? 'Loading messages...' : `Messages (${messages.length})`}
          </h3>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading birthday wishes...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center">
              <p className="text-gray-600 text-lg mb-2">Be the first to share your wishes! 💛</p>
              <p className="text-gray-500">Your message will appear here shortly.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {messages.map((msg, idx) => (
                <div
                  key={msg.id || idx}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-pink-400"
                >
                  <p className="font-bold text-lg text-pink-600 mb-2">{msg.sender_name}</p>
                  <p className="text-gray-700 text-base leading-relaxed">{msg.message}</p>
                  {msg.created_at && (
                    <p className="text-sm text-gray-500 mt-3">
                      {new Date(msg.created_at).toLocaleDateString([], { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
