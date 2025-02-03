import Animate from "../Animate"
import BlogCard from "../BlogCard"
import Container from "../Container"

const InsightListing = () => {
  return (
    <section className="py-10 lg:py-14">
      <Container>
        <Animate as="h1" className="h2 mb-2 text-primary text-center">Namaz Insights</Animate>
        <Animate as="p" className="lg:text-xl leading-[1.5] text-center text-primary mb-12 lg:mb-14">Unlock the full potential of your spiritual journey with our Conscious Namaz Subscription Plan.</Animate>
        <div className="-mx-2 lg:-mx-4 flex flex-wrap -my-5">
          {
            data?.map((item, index) => (
              <Animate className="px-2 w-full lg:w-1/3 lg:px-4 mt-5" key={index}>
                <BlogCard
                  title={item.title}
                  description={item.description}
                  img={item.img}
                  time={item.time}
                  url={item.url}
                />
              </Animate>
            ))
          }
        </div>
        <div className="border-b border-black mt-8 lg:mt-20 xl:mt-[100px]"></div>
      </Container>
    </section>
  )
}

export default InsightListing


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
  },
]