"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Container from '@/src/components/Container';

const CheckoutSuccessPage = () => {
  return (
    <div className="py-16 lg:py-24">
      <Container>
        <div className="text-center max-w-[600px] mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="h2 mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been successfully processed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/programs" 
              className="bg-primary text-white py-3 px-6 rounded-md inline-block hover:bg-opacity-90 transition-all"
            >
              Browse More Programs
            </Link>
            <Link 
              href="/" 
              className="border border-primary text-primary py-3 px-6 rounded-md inline-block hover:bg-gray-50 transition-all"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CheckoutSuccessPage; 