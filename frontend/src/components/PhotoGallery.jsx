import { useState, useEffect } from 'react'
// import axios from 'axios'

const gallerySources = {
  announcements: import.meta.glob('../assets/announcements/*.{jpg,jpeg,JPG,JPEG}', { eager: true }),
  about: import.meta.glob('../assets/about/*.{jpg,jpeg,JPG,JPEG}', { eager: true }),
  'wheelock-house': import.meta.glob('../assets/wheelock-house/*.{jpg,jpeg,JPG,JPEG}', { eager: true }),
  'wheelock-weekend': import.meta.glob('../assets/wheelock-weekend/*.{jpg,jpeg,JPG,JPEG}', { eager: true }),
};

export default function PhotoGallery({ page, className = '' }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // This tells Vite to find all .jpg and .jpeg files in that specific folder
  const modules = gallerySources[page] || {};

  // Convert the object into an array of image paths
  const images = Object.values(modules).map((mod) => mod.default);
  
  useEffect(() => {
    setCurrentIndex(0);
  }, [page]);

  useEffect(() => {
    if (images.length === 0) return

    // Auto-rotate images every 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images])

  // const fetchPhotos = async () => {
  //   try {
  //     setLoading(true)
  //     setError(null)
  //     const response = await axios.get(`/api/photos/${page}`)
  //     setImages(response.data.images)
  //     setCurrentIndex(0)
  //   } catch (err) {
  //     console.error(`Error fetching photos for ${page}:`, err)
  //     setError('Unable to load photos')
  //   } finally {
  //     setLoading(false)
  //   }
  // }
  console.log('Page:', page, 'Modules found:', modules, 'Images array:', images);
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }
  // if (loading) {
  //   return <div className={`${className} bg-gray-100 rounded flex items-center justify-center h-64`}>Loading photos...</div>
  // }

  // if (error || images.length === 0) {
  //   return <div className={`${className} bg-gray-100 rounded flex items-center justify-center h-64 text-gray-500`}>
  //     {error || 'No photos available'}
  //   </div>
  // }

  return (
    <div className={`${className} relative bg-gray-200 rounded overflow-hidden group`}>
      {/* Image Container */}
      <div className="relative w-full h-96">
        <img
          src={images[currentIndex]}
          alt={`Photo ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next photo"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Photo Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Dot Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-opacity ${
                index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-40'
              }`}
              aria-label={`Go to photo ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
