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
  const [bannerSettings, setBannerSettings] = useState({
    description: "JOIN US FOR THREE NIGHTS OF TAHAJJUD NAMAZ AND WITNESS YOURSELF THE POWER OF CONSCIOUS PRAYING",
    price: 1999,
    originalPrice: 2999
  });

  // Fetch banner settings from the API
  useEffect(() => {
    const fetchBannerSettings = async () => {
      try {
        const response = await fetch("/api/banner-settings");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Banner API response:", data); // Debug log
        
        if (data.success && data.bannerSettings) {
          // Extract only the needed fields from the MongoDB document
          const { description, price, originalPrice } = data.bannerSettings;
          setBannerSettings({
            description: description || bannerSettings.description,
            price: price || bannerSettings.price,
            originalPrice: originalPrice || bannerSettings.originalPrice
          });
        }
      } catch (error) {
        console.error("Error fetching banner settings:", error);
      }
    };

    fetchBannerSettings();
  }, []);

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
                <p className="lg:text-lg max-w-[780px] leading-[1.5] uppercase">
                  {bannerSettings.description}{" "}
                  <span className="font-medium">
                    (Offered Price {bannerSettings.price}RS -{" "}
                    <span className="line-through">{bannerSettings.originalPrice}RS</span>)
                  </span>
                </p>
                <Button
                  className={"xl:min-w-[340px]"}
                  varient="light"
                  onClick={() => createOrder(bannerSettings.price)}
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

              {/* Desktop close button */}
              <button
                className={
                  "hidden lg:flex absolute top-[-50px] right-4 !p-0 size-10 rounded-full items-center justify-center border border-gray-200 !text-white !bg-[#F5F5F5] z-[3]"
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
