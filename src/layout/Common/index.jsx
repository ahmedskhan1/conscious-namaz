import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const CommonLayout = ({ children }) => {

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default CommonLayout;
