'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/src/components/Container';
import Link from 'next/link';

export default function NewBlogPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    slug: '',
    readTime: '',
    published: true,
    featured: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    setFormData({
      ...formData,
      slug,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if image is provided
      if (!imageFile) {
        throw new Error('Please select an image for the blog');
      }

      // Create FormData object for multipart/form-data submission
      const blogFormData = new FormData();
      
      // Add all form fields
      blogFormData.append('title', formData.title);
      blogFormData.append('description', formData.description);
      blogFormData.append('content', formData.content);
      blogFormData.append('slug', formData.slug);
      blogFormData.append('readTime', formData.readTime);
      blogFormData.append('published', formData.published.toString());
      blogFormData.append('featured', formData.featured.toString());
      
      // Add the image file
      blogFormData.append('image', imageFile);

      const response = await fetch('/api/admin/blogs', {
        method: 'POST',
        body: blogFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create blog');
      }

      router.push('/admin/blogs');
    } catch (error) {
      console.error('Error creating blog:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Create New Blog</h1>
        <Link href="/admin/blogs" className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
          Back to Blogs
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={generateSlug}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Slug</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={generateSlug}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Generate
            </button>
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="3"
            className="w-full p-2 border border-gray-300 rounded"
          ></textarea>
        </div>

        <div>
          <label className="block mb-2 font-medium">Read Time</label>
          <input
            type="text"
            name="readTime"
            value={formData.readTime}
            onChange={handleChange}
            required
            placeholder="e.g. 5 min read"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Content (HTML)</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="10"
            className="w-full p-2 border border-gray-300 rounded font-mono text-sm"
          ></textarea>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="mr-2"
            />
            Published
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="mr-2"
            />
            Featured
          </label>
        </div>

        <div>
          <label className="block mb-2 font-medium">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded"
          >
            {loading ? 'Creating...' : 'Create Blog'}
          </button>
        </div>
      </form>
    </Container>
  );
} 