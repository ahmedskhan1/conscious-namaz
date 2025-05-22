'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const BlogCard = ({ img, title, description, time, url, slug }) => {
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    setImgError(true);
  };
  
  // If no URL is provided, don't make the card clickable
  if (!url && !slug) {
    return (
      <div className='flex flex-col h-full'>
        <figure className='overflow-hidden pb-[56.28%] rounded-[3px] mb-2 lg:mb-3 relative bg-gray-100'>
          {(img && !imgError) ? (
            <Image
              src={img}
              alt={title || "Blog post"}
              fill
              className='object-cover'
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <span className="text-gray-500">Image unavailable</span>
            </div>
          )}
        </figure>
        <div className='flex flex-1 flex-col text-primary'>
          <h4 className='text-xl lg:text-2xl leading-6 mb-2 line-clamp-2'>{title}</h4>
          <p className="lg:text-lg leading-6 line-clamp-2 mb-2">{description}</p>
          <span className='text-lg font-semibold mt-auto'>{time}</span>
        </div>
      </div>
    );
  }
  
  // Generate URL if not provided but slug is
  const href = url || `/insights/${slug}`;

  return (
    <Link href={href} className='flex flex-col h-full group'>
      <figure className='overflow-hidden pb-[56.28%] rounded-[3px] mb-2 lg:mb-3 relative bg-gray-100'>
        {(img && !imgError) ? (
          <Image
            src={img}
            alt={title || "Blog post"}
            fill
            className='object-cover group-hover:scale-105 transition-transform duration-300'
            onError={handleImageError}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">Image unavailable</span>
          </div>
        )}
      </figure>
      <div className='flex flex-1 flex-col text-primary'>
        <h4 className='text-xl lg:text-2xl leading-6 mb-2 line-clamp-2'>{title}</h4>
        <p className="lg:text-lg leading-6 line-clamp-2 mb-2">{description}</p>
        <span className='text-lg font-semibold mt-auto'>{time}</span>
      </div>
    </Link>
  )
}

export default BlogCard