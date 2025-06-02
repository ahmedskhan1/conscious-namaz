'use client'

import Animate from "../Animate"
import BlogCard from "../BlogCard"
import Container from "../Container"
import { useEffect, useState } from "react"

const InsightListing = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        
        // Use relative path for client-side requests
        const apiUrl = '/api/blogs';
        
        // Add timestamp to bust cache
        const cacheBuster = `?t=${new Date().getTime()}`;
        
        const response = await fetch(apiUrl + cacheBuster, {
          // Use cache: 'no-store' to force a network request
          cache: 'no-store',
          headers: {
            'Accept': 'application/json',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch blogs: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.blogs || !Array.isArray(data.blogs)) {
          throw new Error('Invalid blog data format received');
        }
        
        console.log(`Fetched ${data.blogs.length} blogs`);
        // Log each blog for debugging in case of URL issues
        data.blogs.forEach(blog => {
          console.log(`Blog: ${blog.title}, Slug: ${blog.slug}, ID: ${blog._id}`);
        });
        
        setBlogs(data.blogs);
        setError(null);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [retryCount]); // Add retryCount to trigger a refetch when retry is clicked

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <section className="py-10 lg:py-14">
      <Container>
        <Animate as="h1" className="h2 mb-2 text-primary text-center">Namaz Insights</Animate>
        <Animate as="p" className="lg:text-xl leading-[1.5] text-center text-primary mb-12 lg:mb-14">Unlock the full potential of your spiritual journey with our Conscious Namaz Subscription Plan.</Animate>
        
        {loading && (
          <div className="text-center py-10">
            <p>Loading blogs...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
        
        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-10">
            <p>No blogs found. Check back soon for new content!</p>
          </div>
        )}
        
        {!loading && !error && blogs.length > 0 && (
          <div className="-mx-2 lg:-mx-4 flex flex-wrap -my-5">
            {blogs.map((blog, index) => {
              if (!blog || !blog.slug) {
                console.error(`Blog at index ${index} has no slug!`, blog);
                return null;
              }
              
              // Double-check slug format
              const slug = blog.slug.trim();
              console.log(`Creating blog card for slug: ${slug}`);
              const url = `/insights/${slug}`;
              
              return (
                <Animate className="px-2 w-full lg:w-1/3 lg:px-4 mt-5" key={blog._id || `blog-${index}`}>
                  <BlogCard
                    title={blog.title}
                    description={blog.description}
                    img={blog.img || `/api/blogs/${blog.slug}/image`}
                    time={blog.readTime || "5 min read"}
                    url={url}
                    slug={slug}
                  />
                </Animate>
              );
            })}
          </div>
        )}
        
        <div className="border-b border-black mt-8 lg:mt-20 xl:mt-[100px]"></div>
      </Container>
    </section>
  )
}

export default InsightListing
