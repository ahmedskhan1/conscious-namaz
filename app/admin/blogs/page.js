'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Container from '@/src/components/Container';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/admin/blogs');
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        setBlogs(data.blogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDeleteBlog = async (id) => {
    if (!confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete blog');
      }

      // Remove the deleted blog from the state
      setBlogs(blogs.filter(blog => blog._id !== id));
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog. Please try again.');
    }
  };

  const togglePublishStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          published: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update blog status');
      }

      const data = await response.json();
      
      // Update the blog status in the state
      setBlogs(blogs.map(blog => 
        blog._id === id ? { ...blog, published: !currentStatus } : blog
      ));
    } catch (error) {
      console.error('Error updating blog status:', error);
      alert('Failed to update blog status. Please try again.');
    }
  };

  return (
    <Container className="py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Blogs</h1>
        <Link href="/admin/blogs/new" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
          Create New Blog
        </Link>
      </div>

      {loading && <p className="text-center py-8">Loading blogs...</p>}
      
      {error && <p className="text-center py-8 text-red-500">{error}</p>}

      {!loading && !error && blogs.length === 0 && (
        <p className="text-center py-8">No blogs found. Create your first blog!</p>
      )}

      {!loading && !error && blogs.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Slug</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Created</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id} className="border-t border-gray-200">
                  <td className="py-3 px-4">{blog.title}</td>
                  <td className="py-3 px-4">{blog.slug}</td>
                  <td className="py-3 px-4">
                    <span 
                      className={`px-2 py-1 rounded text-sm ${
                        blog.published ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Link 
                        href={`/admin/blogs/${blog._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => togglePublishStatus(blog._id, blog.published)}
                        className="text-yellow-600 hover:underline"
                      >
                        {blog.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button 
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
} 