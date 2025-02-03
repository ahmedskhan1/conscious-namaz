import Image from 'next/image'
import React from 'react'

const VideoCard = ({ img, title, description, url }) => {
    return (
        <a href={url || ""} target="_blank" className='flex flex-col h-full group rounded-md overflow-hidden'>
            <figure className='overflow-hidden pb-[56.28%] relative'>
                <Image
                    src={img || ""}
                    alt={title || ""}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform duration-300'
                />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[3]">
                    <img src="/images/playicon.svg" alt="playicon"></img>
                </span>
            </figure>
            <div className='flex flex-1 flex-col text-primary rounded-b-md border border-primary border-t-0 p-5 pt-3'>
                <h4 className='text-xl lg:text-2xl leading-6 mb-2 line-clamp-2'>{title}</h4>
                <p className="lg:text-lg leading-[27px] line-clamp-2 ">{description}</p>
            </div>
        </a>
    )
}

export default VideoCard