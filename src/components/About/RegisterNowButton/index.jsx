"use client";

import React from "react";
import Button from "../../Button";
import createOrder from "@/src/utils/payment";

const RegisterNowButton = () => {
  return (
    <Button
      className={"xl:min-w-[340px]"}
      varient="light"
      onClick={() => createOrder(99)}
    >
      register now
    </Button>
  );
};

export default RegisterNowButton;
