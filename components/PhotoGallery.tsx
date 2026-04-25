'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Photo {
  id: string
  url: string
  alt: string
}

const defaultPhotos: Photo[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&h=500&fit=crop', alt: 'Birthday celebration' },
  { id: '2', url: 'https://images.unsplash.com/photo-1551632786-de41ec18b67b?w=500&h=500&fit=crop', alt: 'Happy moments' },
  { id: '3', url: 'https://images.unsplash.com/photo-1558636508-e0db3814a69e?w=500&h=500&fit=crop', alt: 'Cake and celebration' },
  { id: '4', url: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=500&h=500&fit=crop', alt: 'Party celebration' },
  { id: '5', url: 'https://images.unsplash.com/photo-1508737119e59d7b7212e39a8220b5f16566aeb2?w=500&h=500&fit=crop', alt: 'Joyful celebration' },
  { id: '6', url: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&h=500&fit=crop', alt: 'Birthday party' },
]

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>(defaultPhotos)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')

  // Load photos from localStorage (simulating Blob persistence)
  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const savedPhotos = localStorage.getItem('chimwemwe_photos')
        if (savedPhotos) {
          const parsedPhotos = JSON.parse(savedPhotos)
          setPhotos([...parsedPhotos, ...defaultPhotos])
        }
      } catch (error) {
        console.error('Error loading photos:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadPhotos()
  }, [])

  const savePhotosToStorage = (updatedPhotos: Photo[]) => {
    try {
      const uploadedPhotos = updatedPhotos.filter((p) => p.id !== '1' && p.id !== '2' && p.id !== '3' && p.id !== '4' && p.id !== '5' && p.id !== '6')
      localStorage.setItem('chimwemwe_photos', JSON.stringify(uploadedPhotos))
    } catch (error) {
      console.error('Error saving photos:', error)
    }
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const blob = await response.json()
        const newPhoto: Photo = {
          id: Date.now().toString(),
          url: blob.url,
          alt: file.name,
        }
        const updatedPhotos = [newPhoto, ...photos]
        setPhotos(updatedPhotos)
        savePhotosToStorage(updatedPhotos)
        setUploadMessage('✨ Photo uploaded successfully!')
        setTimeout(() => setUploadMessage(''), 3000)
      } else {
        setUploadMessage('❌ Failed to upload photo. Please try again.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadMessage('❌ Error uploading photo. Please try again.')
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  return (
    <section id="gallery" className="py-16 px-4 bg-gradient-to-b from-yellow-50 to-pink-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
          Photo Gallery
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Beautiful moments and memories
        </p>

        {/* Upload Section */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-dashed border-pink-300 hover:border-pink-500 transition-colors">
            <label className="flex flex-col items-center justify-center cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={isUploading}
                className="hidden"
              />
              <span className="text-5xl mb-4">📷</span>
              <span className="text-xl font-semibold text-gray-700 mb-2">
                {isUploading ? 'Uploading...' : 'Click to upload a photo'}
              </span>
              <span className="text-gray-500">or drag and drop your image here</span>
            </label>
            {uploadMessage && (
              <p className="mt-4 text-center text-lg font-semibold text-pink-600">
                {uploadMessage}
              </p>
            )}
          </div>
        </div>

        {/* Photo Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">Loading photos...</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow"
            >
              <div className="relative w-full h-80">
                <Image
                  src={photo.url}
                  alt={photo.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-pink-600/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                <p className="text-white font-semibold text-center">{photo.alt}</p>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  )
}
