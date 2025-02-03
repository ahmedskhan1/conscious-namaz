import AboutConscios from "@/src/components/About/AboutConscios";
import AboutProgram from "@/src/components/About/AboutProgram";
import AboutWelcome from "@/src/components/About/AboutWelcome";
import ProgramContainer from "@/src/components/About/ProgramContainer";
import RegisterNowButton from "@/src/components/About/RegisterNowButton";
import Animate from "@/src/components/Animate";
import Container from "@/src/components/Container";
import Image from "next/image";
import React, { Suspense } from "react";

export const metadata = {
  title: "About Us - Conscious Namaz",
  description: "Learn more about us on this page.",
};

const AboutPage = () => {
  return (
    <main className="pb-10 lg:pb-20">
      <AboutWelcome />

      <Container className={"py-7 lg:py-14 text-primary"}>
        <Animate
          as="h2"
          className="h2 ff-2 text-center px-5 max-w-[1200px] mx-auto leading-[1.2]"
        >
          Do you think the way you offer Namaz every day is the most powerful
          way? If you feel yes, your life will be nothing less than a blessing.
        </Animate>
      </Container>

      <Container className={"py-7 lg:py-14 text-primary"}>
        <div className="-mx-2 lg:-mx-7 flex lg:flex-wrap flex-wrap-reverse -mt-5 lg:items-center">
          <Animate className="px-2 w-full lg:w-1/2 lg:px-7 mt-5">
            <h2 className="ff-2 mb-5 lg:mb-8 text-[32px] lg:text-[40px] leading-[1.2]">
              Discover the power of conscious praying and witness how your life
              changes for the best.
            </h2>
            <p className="lg:text-lg leading-[1.5]">
              Allah has constructed the universe with a sacred mathematical
              precision of laws, and the universe functions in accordance to
              these laws. The ultimate test for a human being is to realise and
              make the best of all these laws of divine nature and carve a
              virtues life out of it. Whoever succeeds in doing so, is not far
              from experiencing Paradise here and after.
            </p>
          </Animate>
          <Animate className="px-2 w-full lg:w-1/2 lg:px-7 mt-5">
            <figure className="relative overflow-hidden pb-[56.57%] ">
              <Image
                src={"/images/about-img-1.webp"}
                alt="about images"
                fill
                className="object-cover"
              />
            </figure>
          </Animate>
        </div>
      </Container>

      <Container className={"py-7 lg:py-14 text-primary"}>
        <Animate>
          <h2 className="ff-2 mb-8 text-[32px] lg:text-[40px] leading-[1.2] lg:text-center">
            What is Conscious Namaz and its purpose?
          </h2>
          <p className="lg:text-lg leading-[1.5] lg:text-center max-w-[1180px] mx-auto">
            Since Namaz is the most powerful and sacred ritual given to mankind,
            it is supposed to be performed with an utter presence of mind and
            not just a subconscious recitation. Have you stopped for a moment
            and thought that the Namaz you offer, is just a subconsciously
            pre-recorded version of something that you learnt as a child? It's
            like a childhood memory playing from your subconscious mind. In
            fact, one of the most important purposes of Namaz is to make you
            more conscious. Conscious praying is when you recite every word
            being totally present (not mind wandering) and while feeling the
            vibration of every word from the Qur'an deep down your heart to your
            spine and skin. At Conscious Namaz we teach you to deeply "feel" the
            prayer you offer (the most important factor responsible for powerful
            prayers) than just mindless recitations and we will enlighten you on
            the do's and don’ts of conscious praying which will help you achieve
            and manifest anything halaal(pure) that you desire.
          </p>
        </Animate>
      </Container>

      <Suspense fallback={<div>Loading Programs...</div>}>
        <AboutProgram />
      </Suspense>
      <AboutConscios />
      <div className="text-white px-5 bg-primary lg:bg-white">
        <Animate className="max-w-[1350px] mx-auto w-full bg-primary py-6 lg:py-10 px-5">
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-10 lg:justify-between lg:items-center max-w-[1070px] mx-auto">
            <p className="lg:text-lg max-w-[780px] leading-[1.5]">
              JOIN US FOR THREE NIGHTS OF TAHAJJUD NAMAZ AND WITNESS YOURSELF
              THE POWER OF CONSCIOUS PRAYING{" "}
              <span className="font-medium">
                (Early bird offer 99RS -{" "}
                <span className="line-through">Price slashed from 2999Rs</span>
                ) 
              </span>
            </p>
            <RegisterNowButton />
          </div>
        </Animate>
      </div>
    </main>
  );
};

export default AboutPage;
