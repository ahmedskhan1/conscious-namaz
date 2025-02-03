"use client"
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";

function Accordion({ title, isOpen = false, children }) {
  const [setActive, setActiveState] = useState(isOpen);
  const [setHeight, setHeightState] = useState("0px");

  const content = useRef(null);

  function toggleAccordion() {
    setActiveState(state=>!state);
  }

  useEffect(() => {
    setHeightState(
        !setActive ? "0px" : `${content?.current?.scrollHeight}px`
      );
  }, [isOpen, setActive, content])
  

  return (
    <div className="flex flex-col border-b border-primary text-primary">
      <button className={`text-start pt-5 pb-7 relative`} onClick={toggleAccordion}>
        <h4 className="text-xl font-medium max-w-[90%]">{title}</h4>
        <span className={`absolute top-1/2 right-2 -translate-y-1/2 transition-transform duration-500 ${!setActive ? "rotate-180" : ""}`}>
          <Image
          src={"/images/arrow-acc.svg"}
          alt="arrow top"
          height={6}
          width={15}
          />
        </span>
      </button>
      <div
        ref={content}
        style={{ maxHeight: `${setHeight}` }}
        className="transition-all duration-500 overflow-hidden"
      >
        <div className="pb-7 pt-3 text-lg leading-[1.5] pe-7 space-y-4">
            {children}
        </div>
      </div>
    </div>
  );
}

export default Accordion;
