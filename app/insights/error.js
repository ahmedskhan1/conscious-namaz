'use client'

import Container from "@/src/components/Container";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Insights page error:', error);
  }, [error]);

  return (
    <Container className="py-20 text-center">
      <h1 className="text-2xl mb-4">Something Went Wrong</h1>
      <p className="mb-6">Sorry, there was an error loading our insights.</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
        <Link href="/" className="px-6 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors">
          Return to Home
        </Link>
      </div>
    </Container>
  );
} 