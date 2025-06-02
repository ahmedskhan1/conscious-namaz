"use client";

import Image from "next/image";
import Button from "../../Button";
import ProgramContainer from "../ProgramContainer";
import Animate from "../../Animate";
import createOrder from "@/src/utils/payment";
import fee from "@/src/utils/fee_static";
const ProgramFour = () => {
  return (
    <>
      <div className="-mx-2 lg:-mx-7 flex flex-wrap -mt-5 lg:-mt-14 lg:items-center flex-col-reverse lg:flex-row">
        <Animate className="px-2 w-full lg:w-2/3 lg:px-7 mt-14 lg:mt-0">
          <h3 className="text-[32px] ff-2 mb-5 lg:mb-8 leading-[1.2]">
            Zikr Meditations for powerful Healing (4999Rs) (11 sessions of one
            hour)
          </h3>
          <p className="lg:text-lg leading-[1.5]">
            This program is for people who are deeply seeking healing. Whether
            it be healing your mind from past traumas, or healing the body from
            deadly diseases or purifying and cleansing your spirit, conscious
            Zikr is the ultimate answer to all.{" "}
          </p>
        </Animate>
        <div className="px-2 w-full lg:w-1/3 lg:px-7 mb-14 lg:mb-0">
          <div className="flex flex-col rounded-md overflow-hidden shadow-xl">
            <figure className="relative overflow-hidden pb-[69.98%]">
              <Image
                src={"/images/home-sub-img-4.jpg"}
                fill
                alt="program images"
                className="object-cover"
              />
            </figure>
            <div className="bg-white p-5">
              <p className="text-lg lg:text-xl mb-5">
                Zikr Meditations for powerful Healing{" "}
                <strong>(4999Rs) (11 sessions of one hour) </strong>
              </p>
              <Button
                className={"w-full"}
                onClick={() => createOrder(fee.zikr_meditations)}
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
    </>
  );
};

export default ProgramFour;
