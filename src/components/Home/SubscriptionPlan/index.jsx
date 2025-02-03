"use client";
import Image from "next/image";
import Container from "../../Container";
import Button from "../../Button";
import Animate from "../../Animate";
import { useRouter } from "next/navigation";
import createOrder from "@/src/utils/payment";
import fee from "@/src/utils/fee_static";

const SubscriptionPlan = () => {
  const router = useRouter();

  const handleLearnMore = (index) => {
    router.push(`/about-us?tab=${index}#about-programs`);
  };
  return (
    <section className="py-16 lg:py-[100px] bg-primary text-white relative lg:shadow-section-shadow lg:bg-vectorImg lg:bg-no-repeat lg:bg-left-top lg:z-[2] lg:relative lg:before:absolute lg:before:w-full lg:before:h-full lg:before:top-0 lg:before:right-0 lg:before:bg-vectorImage lg:before:z-[-1] lg:before:bg-no-repeat lg:before:bg-right-bottom">
      <Container>
        <Animate className="text-center max-w-[700px] mx-auto mb-7 lg:mb-16">
          <h2 className="h2 mb-2">Subscription plan</h2>
          <p className="lg:text-xl leading-1.5">
            Unlock the full potential of your spiritual journey with our
            Conscious Namaz Subscription Plan.
          </p>
        </Animate>
        <div className="flex flex-wrap -mx-4 lg:-mx-6 gap-y-5">
          <Animate className="w-full md:w-1/2 xl:w-1/4 px-4 lg:px-6">
            <div className="flex h-full flex-col">
              <figure className="relative overflow-hidden pb-[62.85%] rounded-t-[6px]">
                <Image
                  src={"/images/home-sub-img-1.webp"}
                  alt=""
                  fill
                  className="object-cover"
                />
              </figure>
              <div className="p-5 flex flex-col bg-white rounded-b-[6px] flex-1">
                <div className="flex-1 flex items-center">
                  <p className="text-lg xl:text-xl text-primary lg:text-black">
                    {" "}
                    Tahajjud Namaz <br />
                    <strong>Three-day</strong> Program
                  </p>
                </div>
                <div className="flex gap-4 gap-lg-5 pt-5">
                  <Button
                    className={"flex-1"}
                    varient="outline-primary"
                    onClick={() => handleLearnMore(0)}
                  >
                    learn more
                  </Button>
                  <Button
                    className={"flex-1"}
                    onClick={() => createOrder(fee.tahajjud_namaz_program)}
                  >
                    BUY NOW
                  </Button>
                </div>
              </div>
            </div>
          </Animate>
          <Animate className="w-full md:w-1/2 xl:w-1/4 px-4 lg:px-6">
            <div className="flex h-full flex-col">
              <figure className="relative overflow-hidden pb-[62.85%] rounded-t-[6px]">
                <Image
                  src={"/images/home-sub-img-2.webp"}
                  alt=""
                  fill
                  className="object-cover"
                />
              </figure>
              <div className="p-5 flex flex-col bg-white rounded-b-[6px] flex-1">
                <div className="flex-1 flex items-center">
                  <p className="text-lg xl:text-xl text-primary lg:text-black">
                    {" "}
                    Personalised and Guided Islamic Meditation{" "}
                    {/* <strong>(3 sessions of one hour each)@ (5999Rs) </strong> */}
                  </p>
                </div>
                <div className="flex gap-4 gap-lg-5 pt-5">
                  <Button
                    className={"flex-1"}
                    varient="outline-primary"
                    onClick={() => handleLearnMore(1)}
                  >
                    learn more
                  </Button>
                  <Button
                    className={"flex-1"}
                    onClick={() =>
                      createOrder(fee.personalised_islamic_meditation)
                    }
                  >
                    BUY NOW
                  </Button>{" "}
                </div>
              </div>
            </div>
          </Animate>
          <Animate className="w-full md:w-1/2 xl:w-1/4 px-4 lg:px-6">
            <div className="flex h-full flex-col">
              <figure className="relative overflow-hidden pb-[62.85%] rounded-t-[6px]">
                <Image
                  src={"/images/home-sub-img-3.webp"}
                  alt=""
                  fill
                  className="object-cover"
                />
              </figure>
              <div className="p-5 flex flex-col bg-white rounded-b-[6px] flex-1">
                <div className="flex-1 flex items-center">
                  <p className="text-lg xl:text-xl text-primary lg:text-black">
                    {" "}
                    Group Meditations{" "}
                    {/* <strong>
                      (8999Rs) (3 sessions of one hour each- Only ten people per
                      session)
                    </strong> */}
                  </p>
                </div>
                <div className="flex gap-4 gap-lg-5 pt-5">
                  <Button
                    className={"flex-1"}
                    varient="outline-primary"
                    onClick={() => handleLearnMore(2)}
                  >
                    learn more
                  </Button>
                  <Button
                    className={"flex-1"}
                    onClick={() => createOrder(fee.group_meditation)}
                  >
                    BUY NOW
                  </Button>
                </div>
              </div>
            </div>
          </Animate>
          <Animate className="w-full md:w-1/2 xl:w-1/4 px-4 lg:px-6">
            <div className="flex h-full flex-col">
              <figure className="relative overflow-hidden pb-[62.85%] rounded-t-[6px]">
                <Image
                  src={"/images/home-sub-img-4.webp"}
                  alt=""
                  fill
                  className="object-cover"
                />
              </figure>
              <div className="p-5 flex flex-col bg-white rounded-b-[6px] flex-1">
                <div className="flex-1 flex items-center">
                  <p className="text-lg xl:text-xl text-primary lg:text-black">
                    {" "}
                    Zikr Meditations for powerful Healing{" "}
                    {/* <strong>(4999Rs) (11 sessions of one hour)</strong> */}
                  </p>
                </div>
                <div className="flex gap-4 gap-lg-5 pt-5">
                  <Button
                    className={"flex-1"}
                    varient="outline-primary"
                    onClick={() => handleLearnMore(3)}
                  >
                    learn more
                  </Button>
                  <Button
                    className={"flex-1"}
                    onClick={() => createOrder(fee.zikr_meditations)}
                  >
                    BUY NOW
                  </Button>
                </div>
              </div>
            </div>
          </Animate>
        </div>
      </Container>
    </section>
  );
};

export default SubscriptionPlan;
