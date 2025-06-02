"use client";
import React, { useState, Suspense, useEffect } from "react";
import Container from "../../Container";
import GenericProgram from "./GenericProgram";
import ProgramOne from "./programOne";
import ProgramTwo from "./programTwo";
import ProgramThree from "./programThree";
import ProgramFour from "./programFour";
import Animate from "../../Animate";
import { useSearchParams } from "next/navigation";

// Create a client component that uses useSearchParams
const ProgramContent = () => {
  const searchParams = useSearchParams();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useOriginalComponents, setUseOriginalComponents] = useState(false);

  useEffect(() => {
    // Ensure this logic runs only on the client side
    if (typeof window !== 'undefined') {
      const tab = parseInt(searchParams.get("tab")) ?? 0;
      setActiveTabIndex(!isNaN(tab) ? tab : 0);
    }

    // Fetch subscriptions from the API
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch('/api/subscriptions');
        const data = await response.json();
        
        if (data.success && data.subscriptions.length > 0) {
          setSubscriptions(data.subscriptions);
          setUseOriginalComponents(false);
        } else {
          // If no subscriptions found or empty array, use original components
          setUseOriginalComponents(true);
        }
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        // On error, use original components
        setUseOriginalComponents(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscriptions();
  }, [searchParams]);

  // Use the dynamic program titles from subscriptions if available, otherwise use fallback
  const programTitles = subscriptions.length > 0 
    ? subscriptions.map(sub => sub.name)
    : fallbackPrograms;

  return (
    <>
      <div className="xl:px-14">
        <Animate className="flex justify-start 2xl:justify-center gap-2.5 sm:gap-5 lg:gap-10 overflow-auto">
          {programTitles.map((program, index) => (
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

      <div className="max-w-[1180px] mx-auto mt-16 lg:mt-20 xl:mt-24">
        <Suspense fallback={<div>Loading...</div>}>
          {useOriginalComponents ? (
            // Use the original program components
            activeTabIndex === 0 ? (
              <ProgramOne />
            ) : activeTabIndex === 1 ? (
              <ProgramTwo />
            ) : activeTabIndex === 2 ? (
              <ProgramThree />
            ) : activeTabIndex === 3 ? (
              <ProgramFour />
            ) : null
          ) : (
            // Use the dynamic content with original program as fallback
            <GenericProgram 
              subscription={subscriptions[activeTabIndex]} 
              useOriginalComponent={
                activeTabIndex === 0 
                  ? ProgramOne 
                  : activeTabIndex === 1 
                  ? ProgramTwo 
                  : activeTabIndex === 2 
                  ? ProgramThree 
                  : ProgramFour
              }
            />
          )}
        </Suspense>
      </div>
    </>
  );
};

// Main component that doesn't directly use useSearchParams
const AboutProgram = () => {
  return (
    <section
      className="bg-[#F6F6F6] pt-5 lg:pt-14 pb-10 text-primary"
      id="about-programs"
    >
      <Container>
        <Animate as="h2" className="h2 ff-2 text-center mb-10 lg:mb-14">
          Programs
        </Animate>
        
        <Suspense fallback={
          <div className="w-full flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        }>
          <ProgramContent />
        </Suspense>
      </Container>
    </section>
  );
};

export default AboutProgram;

// Fallback program titles in case API call fails
const fallbackPrograms = [
  "Three-day Tahajjud Namaz Program",
  "Personalised and Guided Islamic Meditation",
  "Group Meditations",
  "Zikr Meditations for powerful Healing",
];
