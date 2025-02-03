"use client"
import React from 'react'
import Container from '../../Container'
import Animate from '../../Animate'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import Image from 'next/image';
import VideoCard from '../../VideoCard';

const HomeVideos = () => {
    return (
        <div className={"py-10 lg:py-[100px]"}>
            <Container>
                <Animate>
                    <h2 className="h2 text-primary text-center leading-[62.4px mb-2">About my Work</h2>
                    <p className="text-center text-primary mb-[30px] lg:mb-[60px]">Join me as I share how Conscious Namaz can transform your life.</p>
                </Animate>
                <Animate className="relative">
                    <Swiper
                        slidesPerView={1.2}
                        spaceBetween={20}
                        modules={[Navigation]}
                        navigation={{
                            prevEl: ".nav-prev",
                            nextEl: ".nav-next",
                            disabledClass: "opacity-0"
                        }}
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
                    >
                        {
                            data?.map((insight, index) => (
                                <SwiperSlide
                                    className="!h-auto"
                                    key={index}>
                                    <VideoCard
                                        title={insight.title}
                                        description={insight.description}
                                        img={insight.img}
                                        url={insight.url}
                                    />
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                    <span className="nav-prev size-10 absolute top-[20%] z-[3] cursor-pointer hover:opacity-75 transition-opacity left-0 -translate-x-1/2 rounded-full hidden lg:flex items-center justify-center border border-gray-200 bg-[#F5F5F5]">
                        <Image
                            src={"/images/arrow-right.svg"}
                            width={20}
                            height={15}
                            alt="arow"
                            className="scale-x-[-1]"
                        />
                    </span>

                    <span className="nav-next size-10 absolute top-[20%] z-[3] cursor-pointer hover:opacity-75 transition-opacity right-0 translate-x-1/2 rounded-full hidden lg:flex items-center justify-center border border-gray-200 bg-[#F5F5F5]">
                        <Image
                            src={"/images/arrow-right.svg"}
                            width={20}
                            height={15}
                            alt="arow"
                        />
                    </span>

                </Animate>
            </Container>
        </div>
    )
}

export default HomeVideos



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