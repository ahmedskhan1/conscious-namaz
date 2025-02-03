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
              src={"/images/insights/img-lg-1.jpg"}
              fill
              alt="img-1"
              className="object-cover"
            />
          </Animate>
          <Animate as="h2" className="text-[32px] lg:text-[40px] leading-[1.2] mb-5 lg:mb-8 ff-2">Discover the Profound Benefits and Transformative Power of a Conscious Prayer Routine</Animate>
          <Animate className="admin-content-area">
            <p>
              The human mind runs on two modes, one is conscious and the other is subconscious. For an average human being, 95% of the time during their state of wakefulness, the subconscious mind operates, and barely 5% the conscious mind comes to play. To understand the conscious mind, we need to first understand the subconscious mind a little deeper. Let’s look into the activities that the subconscious mind operates with,
            </p>
            <ol>
              <li>
                When you wake up from bed, you get down in a specific manner and walk to the bathroom and brush your teeth in a specific way only, and this is not something you are doing will fully, but it is happening. Just like every day morning. This happens because your subconscious mind has an imprint of this program (waking up and brushing your teeth) and it happens just as it happens all the time even when your mind during an early morning is wandering at your boss’s office or somewhere more stressful.
              </li>
              <li>Another example of a subconscious mind activity is driving a car or riding a motor bike. When you are on the steering wheel, you turn, clutch, brake, accelerate, look in the rare view mirror without you even thinking about it again while your mind is wandering somewhere else. Since you have done this so many times, now your sub conscious mind can do it by itself without any of your assistance.</li>
              <li>If you are an angry and grumpy adult, and walking on a street and someone accidently stamped your feet, and you immediately cuss out all the dictionary in your mind with out thinking if it was an accident or a pure mistake. This is the subconscious mind being trained to respond in this way. Now if you were a conscious being, you would stop for a moment and think if the other person totally did not intend to hurt you and is apologetic and you just smile and walk away consciously choosing to not spoil the rest of your day. </li>
            </ol>
            <p>Using the subconscious mind for mundane activities is fine, but to take important life decisions, one must have a trained conscious mind. When your mind is conscious, your mind detaches from all the subconscious activity and the energy it is depleting towards mental tasks that are not even important.</p>
            <p>Now applying the same understanding to praying Namaz, we understand that when most people prepare for offering a Namaz, they simply walk into a masjid with a mind that is still occupied with mundane tasks and rush to offer Wuduh. They simply sit with their hands under running water thinking how bad their day was and the subconscious mind does the ritual of washing the hands, ears, head, face, arms and feet just without one even noticing. Wuduh itself is a very important part of the Namaz, your Namaz technically starts at the point you start offering Wuduh. When one is offering Wuduh, one should empty their mind and become conscious of the water cleansing the face, hands and feet, while reciting the Wuduh Dwa being fully conscious. This way you are first cleansing every drop of water with the vibration of the powerful Dwa and then letting that water absorb in your skin and body. Once you are done offering Wuduh you should keep a conscious effort to keep your mind empty and proceed for offering the Namaz.</p>
            <p>Now when you stand to begin with offering Namaz with an empty mind, you will have the capability to surrender your focus on every verse that is recited by you or the one hosting the prayer. If you have your mind still occupied by thoughts of every thing else but Namaz, every sacred and powerful vibration of the versus from the holy Quran will just reach your ear but not your mind and spirit, while the main purpose of the Namaz ritual is to cleanse your mind, body and spirit and raise your vibrations to create space for receiving all the blessings from Allah that you desire.</p>
            <p>Most people think once the Namaz is finished the ritual is completed, but it is not true. The Namaz ritual is supposed to be followed by a closed eye meditation while being seated, where one has to recite various powerful Dwa’s and Surah’s and recite Alhamdulillah, Allahu Akbar and Subhan Allah for 33 times each, in a very specific way, again “while keeping” the mind empty from any worldly business (to reap maximum benefit).</p>
          </Animate>
          <div className="border-b border-black my-5 lg:my-14"></div>

          <Animate className="flex justify-between gap-14">
            <div className="flex-1">

            </div>
            <div className="flex-1 ">
              <Link href={"/insights/article-two"} className="flex flex-col items-end text-right">
                <div className="flex flex-row-reverse lg:flex-col lg:items-end lg:mb-3 items-center gap-3 lg:gap-0">
                  <span className="size-10 rounded-full flex items-center justify-center border border-gray-200 bg-[#F5F5F5]">
                    <Image
                      src={"/images/arrow-right.svg"}
                      width={20}
                      height={15}
                      alt="arow"
                    />
                  </span>
                  <span className="text-xl font-medium lg:mt-3">Next Blog</span>
                </div>
                <h4 className="hidden lg:[display:-webkit-box] line-clamp-2 text-2xl font-medium leading-[1.2]">The power of conscious Namaz to heal the mind, body and spirit and power of...</h4>
              </Link>
            </div>
          </Animate>
        </Animate>
      </section>

    </main>
  )
};

export default ArticleOnePage;
