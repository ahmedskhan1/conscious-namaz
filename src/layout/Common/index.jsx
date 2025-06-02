"use client";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { CartProvider } from "@/src/context/CartContext";

const CommonLayout = ({ children }) => {
  return (
    <CartProvider>
      <Header />
      {children}
      <Footer />
    </CartProvider>
  );
};

export default CommonLayout;
