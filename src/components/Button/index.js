"use client";

import Link from "next/link";
import React from "react";

const Button = ({
  className,
  href,
  children,
  varient = "primary",
  ...props
}) => {
  const variantClass = {
    default: "py-3 px-4 rounded-[3px] uppercase transition-colors",
    primary: "bg-primary hover:bg-primaryhover text-white",
    light: "bg-white hover:bg-[#f6f6f6] text-primary",
    "outline-primary":
      "border border-primary text-primary bg-white hover:bg-[#f6f6f6]",
  };

  const btnClass = `${variantClass.default} ${variantClass[varient]} ${className}`;

  return href ? (
    <Link href={href} className={btnClass} {...props}>
      {children}
    </Link>
  ) : (
    <button className={btnClass} {...props}>
      {children}
    </button>
  );
};

export default Button;
