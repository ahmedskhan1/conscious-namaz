"use client";

import Image from "next/image";
import Button from "../../Button";
import ProgramContainer from "../ProgramContainer";
import Animate from "../../Animate";
import createOrder from "@/src/utils/payment";
import fee from "@/src/utils/fee_static";
const ProgramThree = () => {
  return (
    <>
      <div className="-mx-2 lg:-mx-7 flex flex-wrap -mt-5 lg:-mt-14 lg:items-center flex-col-reverse lg:flex-row">
        <Animate className="px-2 w-full lg:w-2/3 lg:px-7 mt-14 lg:mt-0">
          <h3 className="text-[32px] ff-2 mb-5 lg:mb-8 leading-[1.2]">
            Group Meditations (8999Rs) (3 sessions of one hour each- Only ten
            people per session)
          </h3>
          <p className="lg:text-lg leading-[1.5]">
            The power of group meditation is way bigger than we can actually
            think. The vary reason a lot of duas (during Namaz and after Namaz)
            are asked to Allah in big groups of people at the mosques is to have
            a super amplified impact of the Dua. The power of pouring the same
            intent at the same time in groups is beyond imaginable. If you are
            seeking some desire to manifest that is very important to you like
            sending healing prayers for a loved one's recovery or have a very
            important job or business deal to fall into place or desiring to
            marry the perfect partner, this program is for you.{" "}
          </p>
        </Animate>
        <div className="px-2 w-full lg:w-1/3 lg:px-7 mb-14 lg:mb-0">
          <div className="flex flex-col rounded-md overflow-hidden shadow-xl">
            <figure className="relative overflow-hidden pb-[69.98%]">
              <Image
                src={"/images/home-sub-img-3.jpg"}
                fill
                alt="program images"
                className="object-cover"
              />
            </figure>
            <div className="bg-white p-5">
              <p className="text-lg lg:text-xl mb-5">
                Group Meditations{" "}
                <strong>
                  (8999Rs) (3 sessions of one hour each- Only ten people per
                  session)
                </strong>
              </p>
              <Button
                className={"w-full"}
                onClick={() => createOrder(fee.group_meditation)}
              >
                BUY NOW
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ProgramContainer>
        <h3>Itinerary of the program</h3>
        <p>
          This meditation session will be hosted in small groups of people
          (maximum ten people) to create a strong bond of energy towards the
          intent every participant desires to manifest. Once the intent is
          connected between every participant, we combine that with a Muraqabah
          and Zikr to amplify what we are asking Allah for.
        </p>
        <p>
          Be it nurturing your spirit by experiencing a deeper connection with
          Allah, or be it healing your physical and mental body, or manifesting
          your perfect life, everything is graciously available if you
          "consciously surrender" to the real power of Tahajjud Namaz.
        </p>
      </ProgramContainer>
    </>
  );
};

export default ProgramThree;
