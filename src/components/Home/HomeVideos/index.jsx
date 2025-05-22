"use client"
import React, { useEffect, useState, useRef } from 'react'
import Container from '../../Container'
import Animate from '../../Animate'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper";
import Image from 'next/image';
import VideoCard from '../../VideoCard';

const HomeVideos = () => {
    const [isClient, setIsClient] = useState(false);
    const swiperRef = useRef(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setIsClient(true);
        
        // Fetch videos from the API
        const fetchVideos = async () => {
            try {
                const response = await fetch('/api/homevideos');
                const data = await response.json();
                
                if (data.success) {
                    setVideos(data.homevideos);
                }
            } catch (error) {
                console.error('Error fetching home videos:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchVideos();
    }, []);

    if (!isClient) return null;

    return (
        <div className={"py-10 lg:py-[100px]"}>
            <Container>
                <Animate>
                    <h2 className="h2 text-primary text-center leading-[62.4px mb-2">About my Work</h2>
                    <p className="text-center text-primary mb-[30px] lg:mb-[60px]">Join me as I share how Conscious Namaz can transform your life.</p>
                </Animate>
                <Animate>
                    <div className="relative flex items-center w-full">
                        <span className="nav-prev size-10 absolute top-1/2 -left-7 -translate-y-1/2 z-[3] cursor-pointer hover:opacity-75 transition-opacity rounded-full hidden lg:flex items-center justify-center border border-gray-200 bg-[#F5F5F5]">
                            <Image
                                src={"/images/arrow-right.svg"}
                                width={20}
                                height={15}
                                alt="arow"
                                className="scale-x-[-1]"
                            />
                        </span>
                        {loading ? (
                            <div className="w-full flex justify-center py-10">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <Swiper
                                slidesPerView={1.2}
                                spaceBetween={20}
                                modules={[Navigation, Autoplay]}
                                navigation={{
                                    prevEl: ".nav-prev",
                                    nextEl: ".nav-next",
                                    disabledClass: "opacity-0"
                                }}
                                autoplay={{
                                    delay: 2000,
                                    disableOnInteraction: true,
                                    pauseOnMouseEnter: false
                                }}
                                loop={videos.length > 4}
                                breakpoints={{
                                    768: {
                                        spaceBetween: 30,
                                        slidesPerView: 3.5
                                    },
                                    992: {
                                        spaceBetween: 30,
                                        slidesPerView: 4
                                    },
                                }}
                                onSwiper={(swiper) => { swiperRef.current = swiper; }}
                                className="w-full"
                            >
                                {
                                    videos?.map((video, index) => (
                                        <SwiperSlide
                                            className="!h-auto"
                                            key={index}
                                            onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
                                            onMouseLeave={() => swiperRef.current?.autoplay?.start()}
                                        >
                                            <VideoCard
                                                title={video.title}
                                                description={video.description}
                                                img={video.img}
                                                url={video.url}
                                            />
                                        </SwiperSlide>
                                    ))
                                }
                            </Swiper>
                        )}
                        <span className="nav-next size-10 absolute top-1/2 -right-7 -translate-y-1/2 z-[3] cursor-pointer hover:opacity-75 transition-opacity rounded-full hidden lg:flex items-center justify-center border border-gray-200 bg-[#F5F5F5]">
                            <Image
                                src={"/images/arrow-right.svg"}
                                width={20}
                                height={15}
                                alt="arow"
                            />
                        </span>
                    </div>
                </Animate>
            </Container>
        </div>
    )
}

export default HomeVideos


/* Original local data array - commented out
const data = [
    {
        title: "Welcome to the Conscious Namaz Community",
        description: "Join us towards creating a world full of conscious muslims.",
        img: "/images/videos/thumbanil1.png",
        url: "https://www.youtube.com/watch?v=Vn0nktHLo6U"
    },
    {
        title: "Power Of Gratitude in Islam",
        description: "Have you wondered why it is very important to  recite `Alhamdulillah` for 33 times after every namaz? In fact it is as important as the namaz itself.",
        img: "/images/videos/thumbanil2.png",
        url: "https://www.youtube.com/watch?v=uN3MWeWazqs"
    },
    {
        title: "The Importance of Conscious Praying",
        description: "We have been asked to pray consciously for  hundreds of years, it's just that we have forgotten the significance of offering namaz in a state of mindfulness. In fact one of the reasons to offer namaz, dwa and zikr is to make one more conscious.",
        img: "/images/videos/thumbanil3.png",
        url: "https://www.youtube.com/watch?v=UpV3PH3R-2E"
    },
    {
        title: "The Power of Tahajjud Prayer",
        description: "We have all at some point witnessed the miracle this powerful moonlight prayer has to offer, but sadly we barely felt the need to offer this namaz for what it can offer.",
        img: "/images/videos/thumbanil4.png",
        url: "https://www.youtube.com/watch?v=rTDtP4zEtCY"
    },

]
*/