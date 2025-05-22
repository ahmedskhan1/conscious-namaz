'use client'

import Container from "@/src/components/Container";
import Link from "next/link";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    // Log when the not-found page is rendered
    console.error('Blog not found - 404 page rendered');
  }, []);

  return (
    <Container className="py-20 text-center">
      <h1 className="text-2xl mb-4">Blog Not Found</h1>
      <p>We couldn't find the blog you're looking for.</p>
      <Link href="/insights" className="mt-4 inline-block text-blue-600 hover:underline">
        Return to Blogs
      </Link>
    </Container>
  );
} 