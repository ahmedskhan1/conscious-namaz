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
              src={"/images/insights/img-lg-2.jpg"}
              fill
              alt="img-1"
              className="object-cover"
            />
          </Animate>
          <Animate as="h2" className="text-[32px] lg:text-[40px] leading-[1.2] mb-5 lg:mb-8 ff-2">The power of conscious Namaz to heal the mind, body and spirit and power of Quranic recitations and vibrations</Animate>
          <Animate className="admin-content-area">
            <p>The reason why Namaz is considered to be a very important ritual in Islam is because of the power it carries. This ritual is dawned upon mankind to perform for minimum of five times a day for not just virtues reasons but also for helping one live this life being healthy, wealthy, joyful and protected. The common way of praying using the subconscious mind barely even reaches the ear without even touching the mind and spirit. Each and every verse and letter from the Holy Quran is designed by Allah in a way that when recited consciously and vibrationally, leads to massive healing beyond one’s imagination. Let’s look at what happens to the body, mind and spirit when the Quranic recitations are performed being fully conscious.</p>
            <h3>BODY</h3>
            <p>When one recites the verses from the Holy Quran consciously and vibrationally feeling the energy of each verse run through their hands into the chest, the human body on the physical level heals (because all the energy centres of the body are connected to our nerve plexus majorly intersecting around the chest region). That is one of the main reasons why we are commanded by Allah to place the palm of both our hands overlapped on to our mid chest while offering Namaz.</p>
            <h3>MIND</h3>
            <p>The mind is one of the most disturbed function in lives of many. We all know if we heal our mind, we transform our life. The mind is very powerful, powerful enough to change your life for the better merely overnight, if cleansed and harnessed in the right way.  While you perform your Namaz and recitations consciously, your intentionally keep your mind in a state of emptiness. This state of emptiness is responsible for healing the mind from compulsive toxicity and helps you become more conscious. Science proves that an average human mind runs 60 to 80 thoughts per minute, which to the scientific community looks like a disaster in one’s head. Once we start offering namaz and Qur’anic recitations consciously and vibrationally, the mind starts to heal, heal from a disastrous 60-80 thoughts per minute to 50, 40, 30 and eventually less. When this cycle of thoughts reduces, we start to save up the energy that was draining towards all those thoughts and redirect that energy towards healing and manifesting what we desire.</p>
            <h3>SPIRIT</h3>
            <p>When we talk about vibrations, we are talking about something that is deeply connected to our spiritual world. If you have been fortunate to witness any Islamic exorcism, you would definitely know the power or Qur’anic verses upon dark spiritual entities. Every word and letter in the holy Quran are vibrationally very very powerful to cleanse and protect us from any spiritual grounds. Regularly offering our Namaz consciously helps us protect ourselves spiritually and definitely helps us towards keeping our vibrations high and when we keep our vibrations high, we keep all the doors open to receive all the blessings from Allah that we desire to manifest.</p>
          </Animate>
          <div className="border-b border-black my-5 lg:my-14"></div>

          <Animate className="flex justify-between gap-14">
            <div className="flex-1">
              <Link href={"/insights/article-one"} className="flex flex-col ">
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
                <h4 className="hidden lg:[display:-webkit-box]  line-clamp-2 text-2xl font-medium leading-[1.5]">Discover the Profound Benefits and Transformative Power of a Conscious Prayer Routine</h4>
              </Link>
            </div>
            <div className="flex-1 ">
              <Link href={"/insights/article-three"} className="flex flex-col items-end text-right">
                <div className="flex flex-row-reverse lg:flex-col lg:items-end items-center gap-3 lg:gap-0 lg:mb-3">
                  <span className="size-10 rounded-full flex items-center justify-center border border-gray-200 bg-[#F5F5F5]">
                    <Image
                      src={"/images/arrow-right.svg"}
                      width={20}
                      height={15}
                      alt="arow"
                    />
                  </span>
                  <span className="lg:text-xl font-medium lg:mt-3">Next Blog</span>
                </div>
                <h4 className="hidden lg:[display:-webkit-box] line-clamp-2 text-2xl font-medium leading-[1.2]">Why is the post Namaz meditation very important?</h4>
              </Link>
            </div>
          </Animate>
        </Animate>
      </section>

    </main>
  )
};

export default ArticleOnePage;
