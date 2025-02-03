import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BlogCard = ({ img, title, description, time, url }) => {
  return (
    <Link href={url || ""} className='flex flex-col h-full group'>
      <figure className='overflow-hidden pb-[56.28%] rounded-[3px] mb-2 lg:mb-3 relative'>
        <Image
        src={img || ""}
        alt={title || ""}
        fill
        className='object-cover group-hover:scale-105 transition-transform duration-300'
        />
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