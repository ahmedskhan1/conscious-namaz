"use client";

import Image from "next/image";
import Button from "../../Button";
import ProgramContainer from "../ProgramContainer";
import Animate from "../../Animate";
import createOrder from "@/src/utils/payment";
import { useState } from "react";

const GenericProgram = ({ subscription, useOriginalComponent }) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Check if subscription data is sufficient
  const hasRequiredData = subscription && 
    subscription.name && 
    subscription.description && 
    subscription.fee;
  
  // If data is incomplete and we have an original component, render it
  if (!hasRequiredData && useOriginalComponent) {
    const OriginalComponent = useOriginalComponent;
    return <OriginalComponent />;
  }
  
  // Otherwise, continue with the generic display
  const handleBuyNow = async (feeAmount) => {
    if (isProcessingPayment || !feeAmount) return;
    
    try {
      setIsProcessingPayment(true);
      await new Promise(resolve => setTimeout(resolve, 10));
      await createOrder(feeAmount);
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsProcessingPayment(false);
    }
  };
  
  return (
    <>
      {isProcessingPayment && (
        <div className="fixed inset-0 bg-primary bg-opacity-60 z-[100] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      
      <div className="-mx-2 lg:-mx-7 flex flex-wrap -mt-14 lg:items-start">
        <Animate className="px-2 w-full lg:w-2/3 lg:px-7">
          <h3 className="text-[32px] ff-2 mb-5 lg:mb-8 leading-[1.2]">
            {subscription.name} {subscription.fee ? `(₹${subscription.fee})` : ''} {subscription.duration ? `(${subscription.duration})` : ''}
          </h3>
          <div 
            className="lg:text-lg leading-[1.5] admin-content-area"
            dangerouslySetInnerHTML={{ __html: subscription.description }} 
          />
        </Animate>
        <div className="px-2 w-full lg:w-1/3 lg:px-7 ">
          <div className="flex flex-col rounded-md overflow-hidden shadow-xl">
            <figure className="relative overflow-hidden pb-[69.98%]">
              <Image
                src={subscription.image || `/images/home-sub-img-${(Math.floor(Math.random() * 4) + 1)}.jpg`}
                fill
                alt={subscription.name || "Program image"}
                className="object-cover"
              />
            </figure>
            <div className="bg-white p-5">
              <p className="text-lg lg:text-xl mb-5">
                {subscription.name}
                {subscription.fee > 0 && <span><br />(₹{subscription.fee})</span>}
                {subscription.duration && <span> {subscription.duration}</span>}
              </p>
              <Button
                className={"w-full"}
                onClick={() => handleBuyNow(subscription.fee)}
                disabled={isProcessingPayment || !subscription.fee}
              >
                BUY NOW
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Display additional content sections */}
      {subscription.sections && subscription.sections.map((section, index) => (
        <ProgramContainer key={index}>
          {section.title && <h3>{section.title}</h3>}
          {section.content && typeof section.content === 'string' ? (
            <p>{section.content}</p>
          ) : (
            section.content && section.content.map((paragraph, pIndex) => (
              <p key={pIndex}>{paragraph}</p>
            ))
          )}
        </ProgramContainer>
      ))}
    </>
  );
};

export default GenericProgram; 