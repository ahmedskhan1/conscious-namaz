"use client"
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Sytle from "./HomeReviews.module.css";
import { useEffect, useRef, useState } from "react";
import { Navigation } from "swiper";
import Animate from "../../Animate";

const HomeReviews = () => {

    const [activeIndex, setactiveIndex] = useState(0);
    const swiperRef = useRef(null);
    const thumbSlideRef = useRef(null);

    const handleSlideChange = (index) => {
        setactiveIndex(index);
        if (swiperRef?.current) {
            swiperRef.current?.swiper?.slideTo(index)
        }
    }

    useEffect(() => {
        thumbSlideRef.current?.swiper?.slideTo(activeIndex);

    }, [activeIndex, thumbSlideRef])


    return (
        <section className="p-5 lg:pt-[100px] lg:pb-14">
            <Animate className="px-5 xl:max-w-[1090px] mx-auto">
                <h2 className="h2 mb-10 lg:mb-14 text-center">Reviews</h2>
                <div className="lg:px-20 xl:px-[130px] relative">
                    <span className="review-prev size-10 absolute top-[50%] z-[3] cursor-pointer hover:opacity-75 transition-opacity left-0 -translate-y-1/2 rounded-full hidden lg:flex items-center justify-center border border-gray-200 bg-[#F5F5F5]">
                        <Image
                            src={"/images/arrow-right.svg"}
                            width={20}
                            height={15}
                            alt="arow"
                            className="scale-x-[-1]"
                        />
                    </span>
                    <span className="review-next size-10 absolute top-[50%] z-[3] cursor-pointer hover:opacity-75 transition-opacity right-0 -translate-y-1/2 rounded-full hidden lg:flex items-center justify-center border border-gray-200 bg-[#F5F5F5]">
                        <Image
                            src={"/images/arrow-right.svg"}
                            width={20}
                            height={15}
                            alt="arow"
                        />
                    </span>

                    <Swiper
                        ref={swiperRef}
                        centeredSlides
                        loop={false}
                        spaceBetween={20}
                        navigation={{
                            prevEl: ".review-prev",
                            nextEl: ".review-next",
                        }}
                        modules={[Navigation]}
                        slidesPerView={3}
                        className={`${Sytle.swiper} mb-10 lg:mb-14`}
                        slideActiveClass={Sytle.slide_active}
                        slideNextClass={Sytle.slide_near}
                        slidePrevClass={Sytle.slide_near}
                        onInit={(e) => setactiveIndex(e?.activeIndex)}
                        onSlideChange={(e) => handleSlideChange(e?.activeIndex)}
                        breakpoints={{
                            992: {
                                slidesPerView: 5,
                                spaceBetween: 30,
                            }
                        }}
                    >
                        {
                            data?.map((item, index) => (
                                <SwiperSlide
                                    onClick={() => handleSlideChange(index)}
                                    key={index} className={`flex items-center justify-center ${Sytle.slide}`}>
                                    <div className="size-[90px] lg:size-[120px] rounded-full overflow-hidden relative">
                                        <figure className="mb-0">
                                            <Image
                                                src={item?.img || ""}
                                                alt={item.name || ""}
                                                fill
                                                className="object-cover"
                                            />
                                        </figure>
                                    </div>
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>
                <Swiper
                    ref={thumbSlideRef}
                    spaceBetween={50}
                    onSlideChange={(e) => swiperRef?.current?.swiper?.slideTo(e?.activeIndex)}
                >
                    {
                        data?.map((item, i) => (
                            <SwiperSlide key={i} className={`flex items-center justify-center ${Sytle.slide}`}>
                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-6 gap-1">
                                        {[...Array(item.star)].map((star, index) => (
                                            <Image
                                                alt="star"
                                                key={index}
                                                src={"/images/reviews/star.svg"}
                                                width={20}
                                                height={20}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-primary lg:text-black text-xl leading-6 mb-6">
                                        {item.content}
                                    </p>
                                    <p className="text-primary lg:text-black text-xl leading-6 italic">{item.name}</p>
                                </div>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>

                <div className="flex lg:hidden justify-center gap-10 mt-10">
                    <span className="review-prev size-10 rounded-full flex items-center justify-center border border-gray-200 bg-[#F5F5F5]">
                        <Image
                            src={"/images/arrow-right.svg"}
                            width={20}
                            height={15}
                            alt="arow"
                            className="scale-x-[-1]"
                        />
                    </span>
                    <span className="review-next size-10 rounded-full flex items-center justify-center border border-gray-200 bg-[#F5F5F5]">
                        <Image
                            src={"/images/arrow-right.svg"}
                            width={20}
                            height={15}
                            alt="arow"
                        />
                    </span>
                </div>
                <div className="border-b border-primary lg:border-black mt-10 lg:mt-14"></div>
            </Animate>
        </section>
    )
}

export default HomeReviews


const data = [
    {
        img: "/images/reviews/img-1.webp",
        star: 5,
        name: "- Zahid pathan - Businessman",
        content: "Firstly, I was thrilled by the knowledge I got to learn from the course, secondly it made me realise the right way to pray and ask Allah for my wishes and dwas. It's impossible to believe the success i achieved in my life after the program."
    },
    {
        img: "/images/reviews/img-2.webp",
        star: 5,
        name: "- Nusrath khan- Engineer",
        content: "I took this course, just because I am Muslim and thought I will gain some sawaab by attending it. But I was wrong. This course made me see Islam in a way no one could ever help me see."
    },
    {
        img: "/images/reviews/img-3.webp",
        star: 5,
        name: "- Safiuddin- Student",
        content: "Assalamualaikum everyone. Being Hafez e Qur'an my self, i was still unaware of the real beauty of namaz and Islam. I am forever grateful for this program. Alhamdulillah!"
    },
    {
        img: "/images/reviews/img-4.webp",
        star: 5,
        name: "- Zaid Nasrullah- Architect",
        content: "A colleague suggested me to attend one session of the tahajjud program because I was praying restlessly to Allah to make one very important thing in my life to fall in place for months. The approach the tahajjud namaz program had towards dua and manifestations blew my mind. In just three days of praying and offering dwa in the conscious way flipped everything in my life like big blessing."
    },
    {
        img: "/images/reviews/img-5.webp",
        star: 5,
        name: "- Sumayya k - House wife",
        content: "Just by praying namaz the right way, made a world of difference in my life. It made me understand the real purpose of tahajjud  namaz and how it makes all dwa's that I ask Allah at night come to me in real life."
    },
]