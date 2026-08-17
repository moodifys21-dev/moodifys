import React, { useState } from 'react'

export interface ProductGalleryProps {
  images: string[]
  productName: string
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Ensure at least one image is available
  const displayImages = images.length > 0 ? images : ['/placeholder.jpg']

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 sm:gap-6 w-full">
      {/* Thumbnail Bar */}
      {displayImages.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 lg:w-20 flex-shrink-0">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImageIndex(idx)}
              className={`relative aspect-[4/5] w-16 lg:w-full overflow-hidden border transition-all duration-150 flex-shrink-0 ${
                activeImageIndex === idx
                  ? 'border-[#090808] ring-1 ring-[#090808]'
                  : 'border-[#BEBDBB]/60 hover:border-[#090808] opacity-75 hover:opacity-100'
              }`}
              aria-label={`View photo ${idx + 1} of ${productName}`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Display */}
      <div className="relative flex-1 aspect-[4/5] overflow-hidden bg-[#E1E0DC] border border-[#BEBDBB]/50 shadow-sm">
        <img
          src={displayImages[activeImageIndex]}
          alt={`${productName} full view`}
          className="w-full h-full object-cover object-center transition-all duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold tracking-widest text-[#090808] uppercase border border-black/10">
          PHOTO {activeImageIndex + 1} OF {displayImages.length}
        </div>
      </div>
    </div>
  )
}
