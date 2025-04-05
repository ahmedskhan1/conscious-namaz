// import Image from "next/image";
// import React from "react";
// import Button from "../../Button";
// import Container from "../../Container";

// const HomeBanner = () => {
//   return (
//     <section className="relative  xl:h-[calc(100vh-var(--header-height))] xl:min-h-[500px] lg:flex xl:items-center">
//       <figure className="relative pb-[58%] lg:pb-0 h-auto lg:absolute top-0 left-0 w-full lg:h-full">
//         <Image src="/images/home-banner.webp" alt="banner images" fill className="object-cover" />
//       </figure>
//       <Container className="relative">
//         <div className="py-7 xl:py-14 xl:px-14 rounded-[20px]  text-center text-primary lg:text-white bg-gradient-to-r from-[#ffffff1a] to-transparent">
//           <h1 className="h1 mb-5 lg:mb-10 leading-[1.1] capitalize">Discover the power of conscious praying and witness how your life changes</h1>
//           <Button className={"xl:min-w-[250px] px-10"}>learn more</Button>
//         </div>
//       </Container>
//       <div className="absolute w-full top-full lg:bottom-0 left-0 z-[9]"><div className="bg-primary text-white py-5 px-5">
//         <div className="max-w-[1306px] mx-auto w-full relative">
//           <div className="flex flex-col lg:flex-row gap-5 lg:gap-10 lg:justify-between">
//             <p className="lg:text-lg max-w-[780px] leading-[1.5]">JOIN US FOR THREE NIGHTS OF TAHAJJUD NAMAZ AND WITNESS YOURSELF THE POWER OF CONSCIOUS PRAYING <span className="font-medium">(Early bird offer 99RS - Price slashed from 2999Rs) </span></p>
//             <Button className={"xl:min-w-[340px]"} varient="light">register now</Button>
//           </div>
//           <Button className={"absolute top-[-40px] right-1 lg:hidden !p-0 size-10 rounded-full flex items-center justify-center border border-gray-200 !text-primary !bg-[#F5F5F5]"}>
//             <Image src={"/images/close.svg"} width={"12"} height={"12"} />
//           </Button>
//         </div>
//       </div>
//       </div>
//     </section>
//   );
// };

// export default HomeBanner;
"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Button from "../../Button";
import Container from "../../Container";
import Animate from "../../Animate";
import Link from "next/link";
import createOrder from "@/src/utils/payment";

const HomeBanner = () => {
  // Retrieve the banner state from localStorage, default to true if not present
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  // Function to handle closing the banner and storing the state in localStorage
  const handleCloseBanner = () => {
    setIsBannerVisible(false);
  };

  return (
    <section className="relative lg:h-[calc(100vh-var(--header-height))] lg:min-h-[500px] lg:flex lg:items-center">
      <figure className="relative pb-[58%] lg:pb-0 h-auto lg:absolute top-0 left-0 w-full lg:h-full">
        <Image
          src="/images/home-banner.webp"
          alt="banner images"
          fill
          className="object-cover"
          priority={true}
        />
      </figure>
      <Container className="relative">
        <Animate className="py-7 lg:py-14 lg:px-14 rounded-[20px] text-center text-primary lg:text-white bg-gradient-to-r from-[#ffffff1a] to-transparent">
          <h1 className="h1 mb-5 lg:mb-10 leading-[1.1] capitalize">
            Discover the power of conscious praying
          </h1>
          <Link
            href="/about-us"
            className="lg:min-w-[250px] p-3 text-[18px] leading-[27px] bg-primary inline-flex justify-center !text-white hover:bg-primaryhover"
          >
            LEARN MORE
          </Link>
        </Animate>
      </Container>

      {/* Conditional rendering of the promotional banner */}
      {isBannerVisible && (
        <div className="fixed w-full bottom-0 left-0 border-t border-[#747B09] z-[9]">
          <div className="bg-primary text-white py-5 px-5">
            <div className="max-w-[1306px] mx-auto w-full relative">
              <div className="flex flex-col lg:flex-row gap-5 lg:gap-10 lg:justify-between">
                <p className="lg:text-lg max-w-[780px] leading-[1.5]">
                  JOIN US FOR THREE NIGHTS OF TAHAJJUD NAMAZ AND WITNESS
                  YOURSELF THE POWER OF CONSCIOUS PRAYING{" "}
                  <span className="font-medium">
                    (Early bird offer 1999RS -{" "}
                    <span className="line-through">2999Rs</span>)
                  </span>
                </p>
                <Button
                  className={"xl:min-w-[340px]"}
                  varient="light"
                  onClick={() => createOrder(99)}
                >
                  register now
                </Button>
              </div>

              {/* Close button to hide the banner */}
              <button
                className={
                  "absolute top-[-40px] right-1 lg:hidden !p-0 size-10 rounded-full flex items-center justify-center border border-gray-200 !text-primary !bg-[#F5F5F5] z-[3] pointer-events-all"
                }
                onClick={handleCloseBanner}
              >
                <Image src={"/images/close.svg"} width={"12"} height={"12"} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeBanner;
