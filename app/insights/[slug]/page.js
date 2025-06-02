import Animate from "@/src/components/Animate";
import Container from "@/src/components/Container";
import Image from "next/image";
import Link from "next/link";
import { notFound } from 'next/navigation';
import connectToDatabase from '../../api/db/mongodb';
import Blog from '../../api/db/models/blog';

// Disable caching with zero revalidation time
export const revalidate = 0;

// This generates static params for the page at build time
export async function generateStaticParams() {
  try {
    await connectToDatabase();
    const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
    return blogs.map((blog) => ({
      slug: blog.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Directly access the database to get blog data
async function getBlogData(slug) {
  try {
    console.log(`Getting blog data for slug: ${slug}`);
    await connectToDatabase();
    
    // Query the database directly
    const blog = await Blog.findOne({ slug, published: true });
    
    if (!blog) {
      console.error(`Blog with slug '${slug}' not found in database`);
      return null;
    }
    
    console.log(`Found blog in database: ${blog.title}`);
    // Convert MongoDB document to plain object
    return JSON.parse(JSON.stringify(blog));
  } catch (error) {
    console.error(`Error fetching blog data for slug '${slug}':`, error);
    return null;
  }
}

// Get a list of all blogs for navigation
async function getAllBlogs() {
  try {
    await connectToDatabase();
    const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(blogs));
  } catch (error) {
    console.error('Error fetching all blogs:', error);
    return [];
  }
}

// Get the next blog for navigation
async function getNextBlog(currentSlug) {
  try {
    const allBlogs = await getAllBlogs();
    
    if (allBlogs.length === 0) {
      return null;
    }
    
    const currentIndex = allBlogs.findIndex(blog => blog.slug === currentSlug);
    
    // If current blog is last or not found, return the first blog
    if (currentIndex === -1 || currentIndex === allBlogs.length - 1) {
      return allBlogs[0];
    }
    
    // Otherwise return the next blog
    return allBlogs[currentIndex + 1];
  } catch (error) {
    console.error('Error finding next blog:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const blog = await getBlogData(slug);
  
  if (!blog) {
    return {
      title: 'Blog Not Found - Conscious Namaz',
      description: 'The blog you are looking for could not be found.',
    };
  }
  
  return {
    title: `${blog.title} - Conscious Namaz`,
    description: blog.description || 'Read our insightful blog post.',
  };
}

export default async function BlogPage({ params }) {
  const { slug } = params;
  
  console.log(`Rendering blog page for slug: ${slug}`);
  
  // Get blog data directly from the database
  const blog = await getBlogData(slug);
  
  if (!blog) {
    console.log(`Blog with slug '${slug}' not found, returning 404 page`);
    return notFound();
  }
  
  const nextBlog = await getNextBlog(slug);
  
  return (
    <main className="py-7 lg:pb-20">
      <Animate as="h1" className="text-center text-[32px] lg:text-[40px] ff-2">Blog</Animate>
      <section className="pt-8 text-primary">
        <Animate className="mx-auto px-5 max-w-[1014px]">
          <Link href={"/insights"} className="inline-flex gap-3 items-center text-lg lg:text-xl">
            <Image
              src={"/images/arrow-right.svg"}
              width={12}
              height={9}
              alt="arrow"
              className="scale-x-[-1]"
            />
            Back
          </Link>
          <Animate as="figure" className="relative overflow-hidden pb-[56.50%] rounded-[3px] my-5 lg:mb-14">
            <Image
              src={blog.img || `/api/blogs/${blog.slug}/image`}
              fill
              alt={blog.title}
              className="object-cover"
              priority
            />
          </Animate>
          <Animate as="h2" className="text-[32px] lg:text-[40px] leading-[1.2] mb-5 lg:mb-8 ff-2">{blog.title}</Animate>
          <Animate className="admin-content-area" dangerouslySetInnerHTML={{ __html: blog.content }} />
          
          <div className="border-b border-black my-5 lg:my-14"></div>

          {nextBlog && (
            <Animate className="flex justify-between gap-14">
              <div className="flex-1">
              </div>
              <div className="flex-1 ">
                <Link href={`/insights/${nextBlog.slug}`} className="flex flex-col items-end text-right">
                  <div className="flex flex-row-reverse lg:flex-col lg:items-end lg:mb-3 items-center gap-3 lg:gap-0">
                    <span className="size-10 rounded-full flex items-center justify-center border border-gray-200 bg-[#F5F5F5]">
                      <Image
                        src={"/images/arrow-right.svg"}
                        width={20}
                        height={15}
                        alt="arrow"
                      />
                    </span>
                    <span className="text-xl font-medium lg:mt-3">Next Blog</span>
                  </div>
                  <h4 className="hidden lg:[display:-webkit-box] line-clamp-2 text-2xl font-medium leading-[1.2]">
                    {nextBlog.title}
                  </h4>
                </Link>
              </div>
            </Animate>
          )}
        </Animate>
      </section>
    </main>
  );
} 