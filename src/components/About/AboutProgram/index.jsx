"use client";
import React, { useState, Suspense, useEffect } from "react";
import Container from "../../Container";
import ProgramOne from "./programOne";
import ProgramTwo from "./programTwo";
import ProgramFour from "./programFour";
import ProgramThree from "./programThree";
import Animate from "../../Animate";
import { useSearchParams } from "next/navigation";

const AboutProgram = () => {
  const searchParams = useSearchParams();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  useEffect(() => {
    // Ensure this logic runs only on the client side
    if (typeof window !== 'undefined') {
      const tab = parseInt(searchParams.get("tab")) ?? 0;
      setActiveTabIndex(!isNaN(tab) ? tab : 0);
    }
  }, [searchParams]);

  return (
    <section
      className="bg-[#F6F6F6] pt-5 lg:pt-14 pb-10 text-primary"
      id="about-programs"
    >
      <Container>
        <Animate as="h2" className="h2 ff-2 text-center mb-10 lg:mb-14">
          Programs
        </Animate>
        <div className="xl:px-14">
          <Animate className="flex justify-start 2xl:justify-center gap-2.5 sm:gap-5 lg:gap-10 overflow-auto">
            {programs.map((program, index) => (
              <div
                key={index}
                className={`w-[300px] flex-shrink-0 lg:w-[320px] p-5 border border-primary cursor-pointer transition-colors text-center flex justify-center items-center xl:hover:bg-primary xl:hover:text-white ${activeTabIndex === index ? "bg-primary text-white" : ""
                  }`}
                onClick={() => setActiveTabIndex(index)}
              >
                <span className="lg:text-lg uppercase font-semibold">
                  {program}
                </span>
              </div>
            ))}
          </Animate>
        </div>

        {/* Wrap dynamic tab content in Suspense */}
        <div className="max-w-[1180px] mx-auto mt-10 lg:mt-20 xl:mt-24">
          <Suspense fallback={<div>Loading...</div>}>
            {activeTabIndex === 0 ? (
              <ProgramOne />
            ) : activeTabIndex === 1 ? (
              <ProgramTwo />
            ) : activeTabIndex === 2 ? (
              <ProgramThree />
            ) : activeTabIndex === 3 ? (
              <ProgramFour />
            ) : null}
          </Suspense>
        </div>
      </Container>
    </section>
  );
};

export default AboutProgram;

const programs = [
  "Three-day Tahajjud Namaz Program",
  "Personalised and Guided Islamic Meditation",
  "Group Meditations",
  "Zikr Meditations for powerful Healing",
];
