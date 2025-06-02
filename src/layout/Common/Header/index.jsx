"use client";
import Animate from "@/src/components/Animate";
import Button from "@/src/components/Button";
import Container from "@/src/components/Container";
import { useCart } from "@/src/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

const Header = () => {
  const [windowWidth, setWindowWidth] = useState(undefined);
  const [hasShowMenu, setHasShowMenu] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartPopupRef = useRef(null);
  const { cartItems, removeFromCart, updateQuantity, getItemCount, getTotalPrice, isCartIconAnimating } = useCart();

  const pathname = usePathname();
  const isMobile = windowWidth < 992;

  useEffect(() => {
    if (typeof window !== "undefined") {
      function handleResize() {
        setWindowWidth(window.innerWidth);
      }

      window.addEventListener("resize", handleResize);

      handleResize();

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    setHasShowMenu(false);
    setIsCartOpen(false);
  }, [pathname]);

  // Close cart popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (cartPopupRef.current && !cartPopupRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleCartPopup = (e) => {
    e.preventDefault();
    setIsCartOpen(!isCartOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-screen z-10 py-3 xl:py-5 bg-white border-b border-[#747B09]">
      <Container className="flex items-center">
        <Link href={"./"} className={`flex max-w-[135px] xl:max-w-[200px] pb-[3px]`}>
          <Image
            src={"/images/logo_lg.svg"}
            alt="Conscious Namaz Logo"
            width={213}
            height={61}
            priority={true}
          />
        </Link>
        {!isMobile ? (
          <>
            <ul className="ms-auto gap-2 xl:gap-5 flex items-center">
              {HEADER_DATA?.links?.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item?.url || ""}
                    className={`py-3 px-3 xl:px-7 text-primary text-xl leading-none hover:bg-gray-200 rounded-md transition-colors ${item?.url === pathname ? "bg-gray-200" : ""}`}
                  >
                    {item?.label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Cart Icon with Popup */}
            <div className="relative ml-2 xl:ml-4" ref={cartPopupRef}>
              <a href="#" onClick={toggleCartPopup} className="block p-2">
                <div className={`${isCartIconAnimating ? 'cart-icon-animate' : ''}`}>
                  <Image
                    src="/images/shopping-cart-black.png"
                    alt="Shopping Cart"
                    width={28}
                    height={28}
                  />
                  {getItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getItemCount()}
                    </span>
                  )}
                </div>
              </a>
              
              {/* Cart Popup */}
              {isCartOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                  <div className="p-4">
                    {getItemCount() > 0 ? (
                      <>
                        <h3 className="text-lg font-medium text-primary mb-3">Your Cart ({getItemCount()})</h3>
                        {/* Cart items */}
                        <div className="max-h-64 overflow-y-auto">
                          {cartItems.map((item, index) => (
                            <div key={index} className="py-2 border-b border-gray-100 flex items-center">
                              {item.image && (
                                <div className="w-12 h-12 mr-3">
                                  <Image 
                                    src={item.image} 
                                    alt={item.name} 
                                    width={48} 
                                    height={48} 
                                    className="rounded-sm object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="text-primary font-medium">{item.name}</p>
                                <div className="flex justify-between items-center mt-1">
                                  <p className="text-gray-600 text-sm">₹{item.price} × {item.quantity}</p>
                                  <button 
                                    onClick={() => removeFromCart(item.id || item.name)}
                                    className="text-red-500 text-sm hover:text-red-700"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-2 border-t border-gray-100">
                          <div className="flex justify-between font-medium mb-3">
                            <span>Total:</span>
                            <span>₹{getTotalPrice()}</span>
                          </div>
                          <Link 
                            href="/cart" 
                            className="w-full bg-primary text-white py-2 px-4 rounded-md text-center block hover:bg-opacity-90 transition-all"
                          >
                            View Cart
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="py-8 text-center">
                        <div className="flex justify-center mb-3">
                          <Image
                            src="/images/shopping-cart-black.png"
                            alt="Empty Cart"
                            width={40}
                            height={40}
                            className="opacity-40"
                          />
                        </div>
                        <p className="text-gray-500 mb-4">Your cart is empty</p>
                        <Link 
                          href="/programs" 
                          className="inline-block bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-all"
                        >
                          Browse Programs
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="ms-auto flex items-center">
              {/* Cart Icon for Mobile with Popup - Now before hamburger menu */}
              <div className="relative mr-4" ref={cartPopupRef}>
                <a href="#" onClick={toggleCartPopup} className="block p-1">
                  <div className={`${isCartIconAnimating ? 'cart-icon-animate' : ''}`}>
                    <Image
                      src="/images/shopping-cart-black.png"
                      alt="Shopping Cart"
                      width={24}
                      height={24}
                    />
                    {getItemCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {getItemCount()}
                      </span>
                    )}
                  </div>
                </a>
                
                {/* Mobile Cart Popup */}
                {isCartOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                    <div className="p-4">
                      {getItemCount() > 0 ? (
                        <>
                          <h3 className="text-lg font-medium text-primary mb-3">Your Cart ({getItemCount()})</h3>
                          {/* Cart items */}
                          <div className="max-h-64 overflow-y-auto">
                            {cartItems.map((item, index) => (
                              <div key={index} className="py-2 border-b border-gray-100 flex items-center">
                                {item.image && (
                                  <div className="w-10 h-10 mr-2">
                                    <Image 
                                      src={item.image} 
                                      alt={item.name} 
                                      width={40} 
                                      height={40} 
                                      className="rounded-sm object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <p className="text-primary font-medium text-sm">{item.name}</p>
                                  <div className="flex justify-between items-center mt-1">
                                    <p className="text-gray-600 text-xs">₹{item.price} × {item.quantity}</p>
                                    <button 
                                      onClick={() => removeFromCart(item.id || item.name)}
                                      className="text-red-500 text-xs hover:text-red-700"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-2 border-t border-gray-100">
                            <div className="flex justify-between font-medium mb-3 text-sm">
                              <span>Total:</span>
                              <span>₹{getTotalPrice()}</span>
                            </div>
                            <Link 
                              href="/cart" 
                              className="w-full bg-primary text-white py-2 px-4 rounded-md text-center block hover:bg-opacity-90 transition-all text-sm"
                            >
                              View Cart
                            </Link>
                          </div>
                        </>
                      ) : (
                        <div className="py-6 text-center">
                          <div className="flex justify-center mb-3">
                            <Image
                              src="/images/shopping-cart-black.png"
                              alt="Empty Cart"
                              width={32}
                              height={32}
                              className="opacity-40"
                            />
                          </div>
                          <p className="text-gray-500 mb-4">Your cart is empty</p>
                          <Link 
                            href="/programs" 
                            className="inline-block bg-primary text-white py-2 px-3 rounded-md text-sm hover:bg-opacity-90 transition-all"
                          >
                            Browse Programs
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Hamburger Menu Button */}
              <span onClick={() => setHasShowMenu(state => !state)}>
                {!hasShowMenu ? (
                  <svg width="25" height="23" viewBox="0 0 25 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line y1="1.8" x2="25" y2="1.8" stroke="#334839" stroke-width="2.4" />
                    <line y1="11.8" x2="25" y2="11.8" stroke="#334839" stroke-width="2.4" />
                    <line y1="21.8" x2="25" y2="21.8" stroke="#334839" stroke-width="2.4" />
                  </svg>
                ) : (
                  <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.5 9L1 16.5M8.5 9L1 1.5M8.5 9L16 16.5M8.5 9L16 1.5" stroke="#334839" stroke-width="2" />
                  </svg>
                )}
              </span>
            </div>
          </>
        )}
        {
          isMobile && (
            <div className={`fixed left-0 w-full top-[67px] px-5 py-5 h-[calc(100dvh-var(--header-height))] bg-white flex flex-col transition-all duration-200 ${hasShowMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
              <ul className="space-y-3">
                {HEADER_DATA?.links?.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item?.url || ""}
                      className={`py-3 text-primary text-2xl flex`}
                    >
                      {item?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        }
      </Container>
    </header>
  );
};

export default Header;

const HEADER_DATA = {
  links: [
    {
      url: "/",
      label: "Home",
    },
    {
      url: "/about-us",
      label: "About",
    },
    {
      url: "/programs",
      label: "Programs",
    },
    {
      url: "/insights",
      label: "Blog",
    },
    {
      url: "/#faq",
      label: "FAQs",
    },
    {
      url: "/terms-and-condition",
      label: "T&C",
    },
  ],
};
