"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Container from "../../Container";
import Button from "../../Button";
import Animate from "../../Animate";
import { useRouter } from "next/navigation";
import createOrder from "@/src/utils/payment";
import { stripHtmlTags } from "@/src/utils/textFormatting";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { useCart } from "@/src/context/CartContext";

const SubscriptionPlan = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const swiperRef = useRef(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    setIsClient(true);
    
    // Fetch subscriptions from the API
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch('/api/subscriptions');
        const data = await response.json();
        
        if (data.success) {
          setSubscriptions(data.subscriptions);
        }
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscriptions();
  }, []);

  const handleLearnMore = (index) => {
    router.push(`/programs?tab=${index}#about-programs`);
  };

  const handleBuyNow = async (plan) => {
    if (isProcessingPayment) return; // Prevent double clicks
    
    try {
      setIsProcessingPayment(true);
      
      // Create cart item from subscription plan
      const cartItem = {
        id: plan._id || `subscription-${Date.now()}`,
        name: plan.name || "Subscription Plan",
        description: plan.description ? stripHtmlTags(plan.description, 100) : "",
        price: plan.fee,
        image: plan.image || `/images/home-sub-img-${Math.floor(Math.random() * 4) + 1}.webp`,
        quantity: 1
      };
      
      // Add to cart using the payment utility
      await createOrder(plan.fee, cartItem);
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Guard against server-side rendering to prevent hydration errors
  if (!isClient) {
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
        </Container>
      </section>
    );
  }

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
        {isProcessingPayment && (
          <div className="fixed inset-0 bg-primary bg-opacity-60 z-[100] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
        <div className="relative">
          {loading ? (
            <div className="w-full flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : (
            <Swiper
              slidesPerView={1.2}
              spaceBetween={16}
              modules={[Navigation, Autoplay]}
              navigation={{
                prevEl: ".subscription-prev",
                nextEl: ".subscription-next",
                disabledClass: "opacity-50"
              }}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              loop={subscriptions.length > 4}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                  spaceBetween: 24
                },
                1200: {
                  slidesPerView: 4,
                  spaceBetween: 24
                },
              }}
              onSwiper={(swiper) => { swiperRef.current = swiper; }}
              className="w-full subscription-slider"
            >
              {subscriptions.length > 0 ? (
                subscriptions.map((plan, index) => (
                  <SwiperSlide key={plan._id || index} 
                    className="!h-auto"
                    onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
                    onMouseLeave={() => swiperRef.current?.autoplay?.start()}
                  >
                    <Animate className="h-full">
                      <div className="flex h-full flex-col">
                        <figure className="relative overflow-hidden pb-[62.85%] rounded-t-[6px]">
                          <Image
                            src={plan.image || `/images/home-sub-img-${(index % 4) + 1}.webp`}
                            alt={plan.name || ""}
                            fill
                            className="object-cover"
                          />
                        </figure>
                        <div className="p-5 flex flex-col bg-white rounded-b-[6px] flex-1">
                          <div className="flex-1 flex items-center">
                            <p className="text-lg xl:text-xl text-primary lg:text-black">
                              {plan.name}
                            </p>
                          </div>
                          {plan.description && (
                            <div className="mt-2 text-sm text-gray-600 line-clamp-2 overflow-hidden">
                              {stripHtmlTags(plan.description, 100)}
                            </div>
                          )}
                          <div className="flex gap-4 gap-lg-5 pt-5">
                            <Button
                              className={"flex-1"}
                              varient="outline-primary"
                              onClick={() => handleLearnMore(index)}
                            >
                              learn more
                            </Button>
                            <Button
                              className={"flex-1"}
                              onClick={() => handleBuyNow(plan)}
                              disabled={isProcessingPayment}
                            >
                              BUY NOW
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Animate>
                  </SwiperSlide>
                ))
              ) : (
                // Fallback to default plans if no subscriptions found
                [1, 2, 3, 4].map((num, index) => (
                  <SwiperSlide key={`fallback-${index}`} className="!h-auto">
                    <Animate className="h-full">
                      <div className="flex h-full flex-col">
                        <figure className="relative overflow-hidden pb-[62.85%] rounded-t-[6px]">
                          <Image
                            src={`/images/home-sub-img-${num}.webp`}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </figure>
                        <div className="p-5 flex flex-col bg-white rounded-b-[6px] flex-1">
                          <div className="flex-1 flex items-center">
                            <p className="text-lg xl:text-xl text-primary lg:text-black">
                              No subscriptions available
                            </p>
                          </div>
                        </div>
                      </div>
                    </Animate>
                  </SwiperSlide>
                ))
              )}
            </Swiper>
          )}
          <button 
            className="subscription-prev size-10 absolute top-1/2 -left-2 lg:-left-5 -translate-y-1/2 z-[3] cursor-pointer hover:opacity-75 transition-opacity rounded-full flex items-center justify-center border border-white bg-primary text-white"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button 
            className="subscription-next size-10 absolute top-1/2 -right-2 lg:-right-5 -translate-y-1/2 z-[3] cursor-pointer hover:opacity-75 transition-opacity rounded-full flex items-center justify-center border border-white bg-primary text-white"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </Container>
    </section>
  );
};

export default SubscriptionPlan;
