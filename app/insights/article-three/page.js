import Animate from "@/src/components/Animate";
import Image from "next/image";
import Link from "next/link";

const ArticleOnePage = () => {
  return (
    <main className="py-7 lg:pb-20">
      <Animate as="h1" className="text-center text-[32px] lg:text-[40px] ff-2">Blog</Animate>
      <section className="pt-8 text-primary">
        <Animate className="mx-auto px-5 max-w-[1014px]">
          <Link href={"./"} className="inline-flex gap-3 items-center text-lg lg:text-xl">
            <Image
              src={"/images/arrow-right.svg"}
              width={12}
              height={9}
              alt="arrow"
              className="scale-x-[-1]"
            />
            Back
          </Link>
          <Animate as="figure" className="relative overflow-hidden pb-[56.50%] rounded-[3px] my-5 lg:mb-14">
            <Image
              src={"/images/insights/img-lg-3.jpg"}
              fill
              alt="img-1"
              className="object-cover"
            />
          </Animate>
          <Animate as="h2" className="text-[32px] lg:text-[40px] leading-[1.2] mb-5 lg:mb-8 ff-2">Why is the post Namaz meditation very important?</Animate>
          <Animate className="admin-content-area">
            <p>As important and sacred the Wuduh is, the last part of the Namaz ritual is equally important. The closed eyed meditation that is suppose to be performed right after offering Namaz holds a very powerful significance is terms of manifesting health wealth and prosperity. Generally, this ritual is performed in a very subconscious way. One just sits with their eyes closed and like a robot repeat every sacred text verbally with out feeling the vibration of the word or even the meaning. At conscious Namaz we make this last part of the ritual as meaningful and powerful as the first two. Though all the three words are powerful among Alhamdulillah, Allahu Akbar and Subhan Allah, my personal favourite is Alhamdulillah, because this is the best way to be grateful and I believe we have plenty of reasons to be grateful for in life, it’s just that we tend to forget the blessings and remember our miseries.</p>
            <p>A recent study at a prestigious university in the United States claimed that just by thinking and visualising thoughts of events you felt blessed and grateful about for two to three times a day (for 9 minutes each) helped research participants to increase the amount of Immunoglobin (IgA- a hormone responsible for immunity in the human body) by a large number. Which means this ritual of reciting alhamdulillah for 33 times is suppose to be performed with more depth to it. Every time you recite alhamdulillah, you are supposed to think of one single thing that Allah has blessed you with while you feel the energy of gratitude deep within you. Similar to the word “Alhamdulillah” carrying the vibration of gratitude, “Subhan Allah” carries the vibration of every bit of creation Allah has bestowed upon mankind. Thus, the best way to recite Subhan Allah being fully conscious is to visualize the breath-taking nature Allah has created all around us. The medical community today claims that if we ground ourselves to nature a strong healing triggers with in the human body. So, every time I recite Subhan Allah, while being in a state of post Namaz meditation or if I am experiencing a beautiful landscape of nature or may be just a simple tree on my backyard, I deeply feel blessed to be around every bit of Allah’s creation. Allahu Akbar on the other hand carries a very powerful vibration too. It is difficult to say which one could be more significant over the other when compared to all three. Allahu Akbar reminds us of Allah’s capability to protect us, to save us, to guide us. Hence every time we recite Allahu Akbar, we should visualize an event when we received some miraculous help, when we were saved by some tragic accident, when we took the perfectly right decision intuitively etc, all this happened because Allah is all giving, the mighty, the powerful.</p>
            <p>Only if all these three powerful words are recited consciously and with a  deep connection with them, we will forever be healthy wealthy and protected.</p>
          </Animate>
          <div className="border-b border-black my-5 lg:my-14"></div>

          <Animate className="flex justify-between gap-14">
            <div className="flex-1">
              <Link href={"/insights/article-two"} className="flex flex-col ">
                <div className="flex lg:flex-col lg:mb-3 items-center lg:items-start gap-3 lg:gap-0">
                  <span className="size-10 rounded-full flex items-center justify-center border border-gray-200 bg-[#F5F5F5]">
                    <Image
                      src={"/images/arrow-right.svg"}
                      width={20}
                      height={15}
                      alt="arow"
                      className="scale-x-[-1]"
                    />
                  </span>
                  <span className="lg:text-xl font-medium lg:mt-3">Previous Blog</span>
                </div>
                <h4 className="hidden lg:[display:-webkit-box]  line-clamp-2 text-2xl font-medium leading-[1.2]">The power of conscious Namaz to heal the mind, body and spirit and power of...</h4>
              </Link>
            </div>
            <div className="flex-1 ">
            </div>
          </Animate>
        </Animate>
      </section>

    </main>
  )
};

export default ArticleOnePage;
