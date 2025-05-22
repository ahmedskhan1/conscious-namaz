import React from "react";
import Image from "next/image";
import Link from "next/link";

const exploreLinks = [
  [
    { href: "/", label: "Home" },
    { href: "/about-us", label: "About Us" },
    { href: "/programs", label: "Programs" },
   
  ],
  [
    { href: "/insights", label: "Blogs" },
    { href: "/#faq", label: "FAQ" },
    { href: "/terms-and-condition", label: "Terms & Conditions" },
  ]
];

const contactInfo = [
  {
    icon: "/images/Location.svg",
    text: "3B 301, 3rd floor, Godrej Royal Woods, Devanahalli, Karnataka, 562110",
    href: "#location",
  },
  {
    icon: "/images/Phone--Streamline-Core.svg",
    text: "+91 91089 28692",
    href: "tel:+919108928692",
  },
  {
    icon: "/images/Mail-Send-Envelope--Streamline-Core.svg",
    text: "info@consciousnamaz.com",
    href: "mailto:info@consciousnamaz.com",
  },
];

const Footer = () => {
  return (
    <footer className="footer bg-white pt-12 pb-6 px-4 md:px-0">
      {/* Main Content Row: 3 columns on desktop, stacked on mobile */}
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-12 md:gap-0">
        {/* Logo Section - slightly left and lower */}
        <div className="w-full md:w-1/3 flex flex-col items-center md:items-end justify-center mb-8 md:mb-0 md:pr-8">
          <div className="flex flex-col md:flex-row md:justify-end md:items-start w-full">
            <div className="mx-auto md:mx-0 md:mr-12 md:mt-16">
              <Image src="/images/logo_lg.svg" alt="logo" width={300} height={61} />
            </div>
          </div>
        </div>
        {/* Explore Section */}
        <div className="w-full md:w-1/3 flex flex-col items-center justify-center mb-8 md:mb-0">
          <h4 className="mb-4 font-serif text-2xl text-primary font-normal text-center">Explore</h4>
          <div className="flex flex-row gap-10 justify-center">
            {exploreLinks.map((col, idx) => (
              <ul key={idx} className="space-y-2">
                {col.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-lg text-gray-700 hover:text-primary font-normal transition-colors font-sans">{link.label}</Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        {/* Contact Info Section - right and lower */}
        <div className="w-full md:w-1/3 flex flex-col items-center md:items-start justify-center md:pl-8">
          <div className="md:mt-8 w-full flex flex-col items-center md:items-start">
            <ul className="space-y-4">
              {contactInfo.map((item, idx) => (
                <li key={idx} className="flex items-center text-lg text-gray-700 font-normal font-sans">
                  <img src={item.icon} className="me-3 w-6 h-6" alt="" />
                  <a href={item.href} className="hover:text-primary transition-colors break-words">{item.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="footer-bottom mt-10 text-center text-xs text-gray-400">
        {/* <p>@ Manifest Your Feelings {currentYear}. All Rights Reserved.</p> */}
        {/* <p>@ Copyright  {currentYear} Manifest Your Feeling | Designed by <Link className="skin" to="http://digitalcreatorz.com/">Digital Creatorz</Link>. All rights reserved.</p> */}
      </div>
    </footer>
  );
};

export default Footer;
