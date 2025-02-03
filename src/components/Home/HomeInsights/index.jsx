"use client"
import Container from "../../Container";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import BlogCard from "../../BlogCard";
import { Navigation } from "swiper";
import Animate from "../../Animate";

const HomeInsights = () => {
  return (
    <section className="py-10">
      <Container>
        <Animate className="mb-10 lg:mb-14 text-center">
          <h2 className="h2 mb-2 text-primary">Namaz Insights</h2>
          <p className="mb-2 text-xl leading-6 text-primary">Explore articles and reflections to enhance your prayer practice and deepen your spiritual connection.</p>
          <Link href={"insights"} className="inline-flex gap-1 items-start leading-none">
            View all
            <Image
              src={"/images/arrow-top.svg"}
              width={9}
              height={9}
              alt="arrow-top"
            />
          </Link>
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
                slidesPerView: 2.5
              },
              992: {
                spaceBetween: 30,
                slidesPerView: 3
              },
            }}
          >
            {
              data?.map((insight, index) => (
                <SwiperSlide
                  className="!h-auto"
                  key={index}>
                  <BlogCard
                    title={insight.title}
                    description={insight.description}
                    img={insight.img}
                    time={insight.time}
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
    </section>
  )
};

export default HomeInsights;



const data = [
  {
    title: "Discover the Profound Benefits and Transformative Power of a Conscious Prayer Routine",
    description: "The human mind runs on two modes, one is conscious and the other is subconscious. For an average human being, 95% of the time during their state of wakefulness, the subconscious mind operates, and barely 5% the conscious mind comes to play. To understand the conscious mind, we need to first understand the subconscious mind a little deeper. Let’s look into the activities that the subconscious mind operates with,",
    img: "/images/insights/img-lg-1.webp",
    time: "15 min read",
    url: "/insights/article-one"
  },
  {
    title: "The Power of Quranic Recitations and Vibrations",
    description: "Delve into the numerous benefits of maintaining a consistent prayer routine. From mental well-being to spiritual growth, see how regular prayer can positively impact various aspects of your life.",
    img: "/images/insights/img-lg-2.webp",
    time: "15 min read",
    url: "/insights/article-two",
  },
  {
    title: "The Importance of the post Namaz meditation",
    description: "Learn about the mental and spiritual benefits of maintaining a consistent prayer routine.",
    img: "/images/insights/img-lg-3.webp",
    time: "8 min read",
    url: "/insights/article-three",
  }
]