"use client";

import Image from "next/image";
import Button from "../../Button";
import ProgramContainer from "../ProgramContainer";
import Animate from "../../Animate";
import createOrder from "@/src/utils/payment";
import fee from "@/src/utils/fee_static";
const ProgramOne = () => {
  return (
    <>
      <div className="-mx-2 lg:-mx-7 flex flex-wrap -mt-14 lg:items-center">
        <Animate className="px-2 w-full lg:w-2/3 lg:px-7 mt-14">
          <h3 className="text-[32px] ff-2 mb-5 lg:mb-8 leading-[1.2]">
            Three-day Tahajjud Namaz Program (2999Rs) (6 sessions)
          </h3>
          <p className="lg:text-lg leading-[1.5]">
            We are all aware of the miracles TAHAJJUD prayer can offer, but
            sadly we have underestimated its power to an extent we almost
            neglected this moon-light prayer. The soul purpose of Conscious
            Namaz is to call every Muslim and also non-Muslim to reap maximum
            benefits of this sacred time and conscious prayer.
          </p>
        </Animate>
        <div className="px-2 w-full lg:w-1/3 lg:px-7 mt-14">
          <div className="flex flex-col rounded-md overflow-hidden shadow-xl">
            <figure className="relative overflow-hidden pb-[69.98%]">
              <Image
                src={"/images/home-sub-img-1.jpg"}
                fill
                alt="program images"
                className="object-cover"
              />
            </figure>
            <div className="bg-white p-5">
              <p className="text-lg lg:text-xl mb-5">
                Tahajjud Namaz
                <br /> <strong>Three-day</strong> Program  (2999Rs)(6 sessions)
              </p>
              <Button
                className={"w-full"}
                onClick={() => createOrder(fee.tahajjud_namaz_program)}
              >
                BUY NOW
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ProgramContainer>
        <p>
          As Muslims we have five prayers that are Farz(compulsory) and the
          sixth prayer is optional but also the most virtues Nafl prayer. This
          prayer is called the Tahajjud Namaz. Since this night time prayer is
          not obligatory, very few of us withdraw the real benefit from it (i.e.
          the power of manifesting anything pure).
        </p>
        <p>
          Be it nurturing your spirit by experiencing a deeper connection with
          Allah, or be it healing your physical and mental body, or manifesting
          your perfect life, everything is graciously available if you
          "consciously surrender" to the real power of Tahajjud Namaz.
        </p>
      </ProgramContainer>
      <ProgramContainer>
        <h3>Why is it important?</h3>
        <p>
          As mentioned in one of the most sacred Hadees (Sacred texts written by
          Prophet’s companions), Sahi-al-Bukhari (1145) narrated by Abu Huraira,
        </p>
        <p>
          Allah's messenger said "Our Lord, the blessed, the Superior, comes
          every night down on the nearest heaven to us when the last third of
          the night begins, saying: Is there any one to invoke me, so that I may
          respond to your invocation? Is there anyone to ask me, so that I can
          grant him his request? Is there anyone seeking my forgiveness, so that
          I may forgive him".
        </p>
        <p>
          As much this sacred moon-light prayer reflects significance in some of
          the well-known Hadees, Allah acknowledges and emphasizes on this
          prayer in the Holy Quran. One of the verses from the Holy Quran
          states, "Indeed, worship in the night is more impactful and suitable
          for recitation. For during the day, you are over occupied by worldly
          duties. Always remember the name of your Lord and devote yourself to
          him wholeheartedly" (Qur'an 73: 6-8)
        </p>
        <p>
          The sacredness of night time worship has been outlined by modern
          science as well. At night when we take a break from our sleep and
          perform any sacred ritual, our mind stays in a state of total
          reception, absorbing the vibrations of every word from the Qur'an to
          the cellular level of our body. Every Dua asked to Allah at this
          sacred hour comes to life because the mind is free from other worldly
          obligations and it consciously makes space for the miracles of
          Tahajjud Namaz to shower over you.
        </p>
      </ProgramContainer>
      <ProgramContainer>
        <h3>
          How will this program help you pray the conscious way and reap all the
          benefits?
        </h3>
        <p>
          At Conscious Namaz we practice "feeling" the Namaz and the dua's we
          offer, followed by tons of gratitude as Allah is an all giver (we just
          need to learn how to ask). It's like how it works in our physical
          lives. If you had to ask your father or friend for something you like
          to have, there is a way to ask for it, if you ask in the wrong way or
          a very feeble way, your chances of "not" getting it are intellectually
          higher. It sounds very simple, yet backed up with 1400 years of rich
          Islamic history and scientific understandings of modern times. As
          quantum science today claims, "feeling is the prayer", we are only
          inclined towards making your heart more grateful and prayerful while
          opening all the gates of receptivity to your desired dua's. By guiding
          you on every step towards praying consciously, we will help you
          manifest anything your heart desires, be it health, wealth or
          prosperity.
        </p>
      </ProgramContainer>
      <ProgramContainer>
        <h3>Itinerary of the program</h3>
        <p>
          This three-day program is conducted in two sessions each day. The
          first session will be scheduled at 9PM and the second session will be
          hosted at 2AM. The evening sessions are mainly focused towards
          understanding how conscious praying is performed and the newly
          discovered science behind it, followed by questions and answers to any
          queries by the participants.
        </p>
        <p>
          The 2AM session is officially Tahajjud Namaz time. This session will
          be completely guided and all the participants will perform a two
          Rakaat Tahajjud Namaz followed by a powerful Islamic Meditation & Dua.
        </p>
      </ProgramContainer>
    </>
  );
};

export default ProgramOne;
