"use client";
import Animate from "@/src/components/Animate";
import Button from "@/src/components/Button";
import Container from "@/src/components/Container";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Header = () => {
  const [windowWidth, setWindowWidth] = useState(undefined);
  const [hasShowMenu, setHasShowMenu] = useState(false);

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
    setHasShowMenu(false)
  }, [pathname])


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
          </>
        ) : (
          <span className="ms-auto" onClick={() => setHasShowMenu(state => !state)}>
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
      url: "/insights",
      label: "Insights",
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
