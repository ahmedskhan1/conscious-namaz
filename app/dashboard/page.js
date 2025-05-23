"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RichTextEditor from '@/src/components/RichTextEditor';
import { htmlToPlainText, plainTextToHtml, containsHtml } from '@/src/utils/textFormatting';
import { uploadToCloudinary } from '@/src/utils/cloudinary';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('subscriptions');
  const router = useRouter();
  
  // State for data
  const [subscriptions, setSubscriptions] = useState([]);
  const [videos, setVideos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [bannerSettings, setBannerSettings] = useState({
    description: '',
    price: 0,
    originalPrice: 0
  });
  
  // Add loading states for each tab
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingBannerSettings, setLoadingBannerSettings] = useState(true);
  
  const [reviewForm, setReviewForm] = useState({
    name: '',
    review: '',
    rating: 5,
    img: ''
  });
  
  // Form states for adding/editing
  const [subscriptionForm, setSubscriptionForm] = useState({
    name: '',
    description: '',
    image: '',
    fee: '',
    duration: ''
  });
  
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    img: '',
    url: ''
  });

  // Blog form state
  const [blogForm, setBlogForm] = useState({
    title: '',
    description: '',
    content: '',
    slug: '',
    readTime: '',
    published: true,
    featured: false
  });
  
  // Add state for file upload
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  // Add state for subscription image file
  const [subImageFile, setSubImageFile] = useState(null);
  const [subImagePreview, setSubImagePreview] = useState('');
  
  // Add state for blog image file
  const [blogImageFile, setBlogImageFile] = useState(null);
  const [blogImagePreview, setBlogImagePreview] = useState('');
  
  // Modal states
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewImageFile, setReviewImageFile] = useState(null);
  const [reviewImagePreview, setReviewImagePreview] = useState('');
  
  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      // Redirect to login if no user data found
      router.push('/login');
      return;
    }
    
    // Parse user data
    setUser(JSON.parse(userData));
    setLoading(false);
    
    // Check Cloudinary configuration
    checkCloudinaryConfig();
    
    // Fetch data when component mounts
    fetchSubscriptions();
    fetchHomeVideos();
    fetchReviews();
    fetchBlogs();
    fetchBannerSettings();
  }, [router]);
  
  // Function to check Cloudinary configuration
  const checkCloudinaryConfig = async () => {
    try {
      const response = await fetch('/api/check-config');
      const data = await response.json();
      
      if (!data.success) {
        console.error('Cloudinary configuration issue:', data.error);
        alert('Warning: Cloudinary configuration might not be properly set up. Image uploads may fail.');
      } else {
        console.log('Cloudinary configuration verified successfully');
      }
    } catch (error) {
      console.error('Failed to check Cloudinary configuration:', error);
    }
  };
  
  // Fetch subscriptions from API
  const fetchSubscriptions = async () => {
    try {
      setLoadingSubscriptions(true);
      console.log('Fetching subscriptions...');
      const response = await fetch('/api/subscriptions');
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response from API (status ${response.status}):`, errorText);
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Subscriptions fetched successfully:', data.subscriptions.length);
        
        // Transform the data to match UI needs
        const transformedData = data.subscriptions.map(sub => ({
          id: sub._id,
          name: sub.name,
          price: `₹${sub.fee}`,
          description: sub.description,
          type: sub.type,
          duration: sub.duration,
          image: sub.image,
          isActive: sub.isActive,
          features: [sub.duration]
        }));
        
        setSubscriptions(transformedData);
        console.log('Subscription state updated with data:', transformedData.length);
      } else {
        console.error('API returned success:false:', data);
        throw new Error(data.error || 'Failed to fetch subscriptions');
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      alert('Error loading subscriptions: ' + error.message);
    } finally {
      setLoadingSubscriptions(false);
    }
  };
  
  // Fetch home videos from API
  const fetchHomeVideos = async () => {
    try {
      setLoadingVideos(true);
      const response = await fetch('/api/homevideos');
      const data = await response.json();
      
      if (data.success) {
        // Transform the data to match UI needs
        const transformedData = data.homevideos.map(video => ({
          id: video._id,
          title: video.title,
          description: video.description,
          thumbnail: video.img,
          duration: '3:45', // Placeholder as duration isn't in the model
          url: video.url
        }));
        
        // Log transformed data to check thumbnail values
        console.log('Transformed video data:', transformedData);
        
        setVideos(transformedData);
      }
    } catch (error) {
      console.error('Error fetching home videos:', error);
    } finally {
      setLoadingVideos(false);
    }
  };
  
  // Fetch reviews from API
  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const response = await fetch('/api/reviews');
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };
  
  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      setLoadingBlogs(true);
      const response = await fetch('/api/admin/blogs');
      const data = await response.json();
      
      if (data.blogs) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      alert('Failed to load blogs. Please try again.');
    } finally {
      setLoadingBlogs(false);
    }
  };
  
  // Fetch banner settings from API
  const fetchBannerSettings = async () => {
    try {
      setLoadingBannerSettings(true);
      const response = await fetch('/api/banner-settings');
      
      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response from API (status ${response.status}):`, errorText);
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Banner settings API response:", data);
      
      if (data.success && data.bannerSettings) {
        // Extract only the needed fields
        const { description, price, originalPrice } = data.bannerSettings;
        setBannerSettings({
          description: description || "",
          price: price || 0,
          originalPrice: originalPrice || 0
        });
      } else {
        console.error("API returned success:false or no bannerSettings:", data);
      }
    } catch (error) {
      console.error('Error fetching banner settings:', error);
    } finally {
      setLoadingBannerSettings(false);
    }
  };
  
  // Handle subscription form change
  const handleSubscriptionFormChange = (e) => {
    const { name, value } = e.target;
    setSubscriptionForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle subscription image change
  const handleSubImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSubImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSubImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle video form change
  const handleVideoFormChange = (e) => {
    const { name, value } = e.target;
    setVideoForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Make sure this is actually a valid image file
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle review form change
  const handleReviewFormChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: name === 'rating' ? Number(value) : value
    }));
  };
  
  // Handle blog form change
  const handleBlogFormChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'published' || name === 'featured' 
      ? e.target.checked 
      : value;
    
    setBlogForm(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  // Handle blog image change
  const handleBlogImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Make sure this is actually a valid image file
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      setBlogImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlogImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Open subscription modal for adding
  const handleAddSubscription = () => {
    setSubscriptionForm({
      name: '',
      description: '',
      image: '',
      fee: '',
      duration: ''
    });
    setSubImagePreview('');
    setCurrentItemId(null);
    setEditMode(false);
    setShowSubscriptionModal(true);
  };
  
  // Open subscription modal for editing
  const handleEditSubscription = (subscription) => {
    // Make sure description is properly handled (it might contain HTML)
    const description = subscription.description || '';
    
    setSubscriptionForm({
      name: subscription.name,
      description: description,
      image: subscription.image || '',
      fee: parseInt(subscription.price.replace('₹', '')),
      duration: subscription.duration || ''
    });
    setSubImagePreview(subscription.image || '');
    setEditMode(true);
    setCurrentItemId(subscription.id);
    setShowSubscriptionModal(true);
  };
  
  // Open video modal for adding
  const handleAddVideo = () => {
    setVideoForm({
      title: '',
      description: '',
      img: '',
      url: ''
    });
    setEditMode(false);
    setCurrentItemId(null);
    setShowVideoModal(true);
  };
  
  // Open video modal for editing
  const handleEditVideo = (video) => {
    setVideoForm({
      title: video.title,
      description: video.description || '',
      img: video.thumbnail || '',
      url: video.url || ''
    });
    setImagePreview(video.thumbnail || '');
    setImageFile(null);
    setEditMode(true);
    setCurrentItemId(video.id);
    setShowVideoModal(true);
  };
  
  // Handle review image change
  const handleReviewImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReviewImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Open review modal for adding
  const handleAddReview = () => {
    setReviewForm({
      name: user.name || user.username,
      review: '',
      rating: 5,
      img: ''
    });
    setReviewImageFile(null);
    setReviewImagePreview('');
    setEditMode(false);
    setCurrentItemId(null);
    setShowReviewModal(true);
  };
  
  // Open review modal for editing
  const handleEditReview = (review) => {
    setReviewForm({
      name: review.name,
      review: review.review,
      rating: review.rating,
      img: review.img || ''
    });
    setReviewImagePreview(review.img || '');
    setReviewImageFile(null);
    setEditMode(true);
    setCurrentItemId(review._id);
    setShowReviewModal(true);
  };
  
  // Open blog modal for adding
  const handleAddBlog = () => {
    setBlogForm({
      title: '',
      description: '',
      content: '',
      slug: '',
      readTime: '',
      published: true,
      featured: false
    });
    setBlogImagePreview('');
    setBlogImageFile(null);
    setEditMode(false);
    setCurrentItemId(null);
    setShowBlogModal(true);
  };

  // Open blog modal for editing
  const handleEditBlog = (blog) => {
    // Make sure content is properly formatted as HTML
    const content = blog.content || '';
    
    setBlogForm({
      title: blog.title,
      description: blog.description || '',
      content: content,
      slug: blog.slug,
      readTime: blog.readTime || '',
      published: blog.published !== false, // Default to true if undefined
      featured: blog.featured === true // Default to false if undefined
    });
    
    // Use the Cloudinary URL directly if available, otherwise use the API route
    if (blog.img && blog.img.includes('cloudinary.com')) {
      setBlogImagePreview(blog.img);
    } else {
      setBlogImagePreview(`/api/blogs/${blog.slug}/image`);
    }
    
    setBlogImageFile(null);
    setEditMode(true);
    setCurrentItemId(blog._id);
    setShowBlogModal(true);
  };
  
  // Submit subscription form
  const handleSubmitSubscription = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      
      // Add file if there is one
      if (subImageFile) {
        try {
          console.log('Uploading subscription image to Cloudinary...');
          const uploadResult = await uploadToCloudinary(subImageFile, 'subscriptions');
          console.log('Cloudinary upload result:', uploadResult);
          
          if (!uploadResult.url || !uploadResult.public_id) {
            throw new Error('Invalid Cloudinary upload result');
          }
          
          formData.append('image', uploadResult.url);
          formData.append('cloudinary_id', uploadResult.public_id);
        } catch (uploadError) {
          console.error('Error uploading image to Cloudinary:', uploadError);
          alert('Failed to upload image. Please try again.');
          return;
        }
      } else if (!editMode) {
        // For new subscriptions, image is required
        alert('Please select an image for the subscription');
        return;
      }
      
      formData.append('name', subscriptionForm.name);
      
      // Ensure description is properly formatted as HTML if it's not already
      const description = containsHtml(subscriptionForm.description) 
        ? subscriptionForm.description 
        : plainTextToHtml(subscriptionForm.description || '');
      formData.append('description', description);
      
      formData.append('fee', subscriptionForm.fee);
      formData.append('duration', subscriptionForm.duration || '');
      
      // Log what we're sending to the API
      console.log('Submitting subscription with data:', {
        name: subscriptionForm.name,
        description: description.substring(0, 50) + '...',
        fee: subscriptionForm.fee,
        duration: subscriptionForm.duration,
        editMode,
        hasImage: !!subImageFile || (editMode && !!subscriptionForm.image)
      });
      
      if (editMode) {
        formData.append('id', currentItemId);
        
        // If we're editing and there's no new file but there is an existing image path
        if (!subImageFile && subscriptionForm.image) {
          formData.append('image', subscriptionForm.image);
        }
        
        // Update endpoint
        const response = await fetch('/api/subscriptions', {
          method: 'PUT',
          body: formData
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response from API:', errorData);
          throw new Error(errorData.error || 'Failed to update subscription');
        }
        
        const data = await response.json();
        console.log('API response:', data);
        
      } else {
        // Create endpoint
        const response = await fetch('/api/subscriptions', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response from API:', errorData);
          throw new Error(errorData.error || 'Failed to create subscription');
        }
        
        const data = await response.json();
        console.log('API response:', data);
      }
      
      setShowSubscriptionModal(false);
      setSubImageFile(null);
      setSubImagePreview('');
      await fetchSubscriptions();
    } catch (error) {
      console.error('Error saving subscription:', error);
      alert('An error occurred while saving the subscription: ' + error.message);
    }
  };
  
  // Submit video form
  const handleSubmitVideo = async (e) => {
    e.preventDefault();
    
    try {
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append('title', videoForm.title);
      formData.append('description', videoForm.description);
      formData.append('url', videoForm.url);
      
      // If we have a new image file, upload it to Cloudinary first
      if (imageFile) {
        try {
          const uploadResult = await uploadToCloudinary(imageFile, 'videos');
          console.log('Cloudinary upload result:', uploadResult);
          
          if (uploadResult.success === false) {
            throw new Error(uploadResult.error || 'Failed to upload image');
          }
          
          formData.append('img', uploadResult.url);
          formData.append('cloudinary_id', uploadResult.public_id);
        } catch (uploadError) {
          console.error('Error uploading image to Cloudinary:', uploadError);
          alert('Failed to upload image. Please try again.');
          return;
        }
      } else if (editMode && videoForm.img) {
        // If editing and no new image is selected, use the existing image URL
        formData.append('img', videoForm.img);
      } else {
        // Add a check for new videos without images
        alert('Image is required. Please select an image file.');
        return;
      }
      
      // If editing, add the ID
      if (editMode) {
        formData.append('id', currentItemId);
      }
      
      // Log what we're sending
      console.log('Submitting video with form data:', Object.fromEntries(formData));
      
      const response = await fetch('/api/homevideos', {
        method: editMode ? 'PUT' : 'POST',
        body: formData,
      });
      
      // Check for non-JSON responses
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned a non-JSON response');
      }
      
      if (data.success) {
        setShowVideoModal(false);
        setImageFile(null);
        setImagePreview('');
        fetchHomeVideos();
      } else {
        console.error('API error:', data);
        alert(data.message || data.error || 'Failed to save video');
      }
    } catch (error) {
      console.error('Error saving video:', error);
      alert('An error occurred while saving the video: ' + error.message);
    }
  };
  
  // Submit review form
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    try {
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append('name', reviewForm.name);
      formData.append('review', reviewForm.review);
      formData.append('rating', reviewForm.rating);
      formData.append('title', reviewForm.name); // Add title as name for compatibility
      formData.append('description', reviewForm.review.substring(0, 100)); // Add description as shortened review
      formData.append('email', user.email || ''); // Add email from user object
      formData.append('approved', true); // Admin submissions are auto-approved
      
      // If we have a new image file, upload it to Cloudinary first
      if (reviewImageFile) {
        try {
          const uploadResult = await uploadToCloudinary(reviewImageFile, 'reviews');
          formData.append('img', uploadResult.url);
          formData.append('cloudinary_id', uploadResult.public_id);
        } catch (uploadError) {
          console.error('Error uploading image to Cloudinary:', uploadError);
          alert('Failed to upload image. Please try again.');
          return;
        }
      } else if (editMode && reviewForm.img) {
        // If editing and no new image is selected, use the existing image URL
        formData.append('img', reviewForm.img);
      }
      
      const url = editMode 
        ? `/api/reviews/${currentItemId}`
        : '/api/reviews';
      
      const method = editMode ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert(`Failed to save review: ${errorData.message || 'Unknown error'}`);
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        setShowReviewModal(false);
        setReviewImageFile(null);
        setReviewImagePreview('');
        fetchReviews();
      } else {
        alert(data.message || 'Failed to save review');
      }
    } catch (error) {
      console.error('Error saving review:', error);
      alert('An error occurred while saving the review');
    }
  };
  
  // Delete subscription
  const handleDeleteSubscription = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        const response = await fetch('/api/subscriptions', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        });
        
        const data = await response.json();
        
        if (data.success) {
          fetchSubscriptions();
        }
      } catch (error) {
        console.error('Error deleting subscription:', error);
      }
    }
  };
  
  // Delete video
  const handleDeleteVideo = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        const response = await fetch('/api/homevideos', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        });
        
        const data = await response.json();
        
        if (data.success) {
          fetchHomeVideos();
        }
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };
  
  // Delete review
  const handleDeleteReview = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const response = await fetch(`/api/reviews/${id}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
          fetchReviews();
        }
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };
  
  // Handle blog submission
  const handleSubmitBlog = async (e) => {
    e.preventDefault();
    
    try {
      // Check for required image when creating a new blog
      if (!editMode && !blogImageFile) {
        alert('Please select an image for the blog');
        return;
      }
      
      // Create form data for multipart/form-data submission
      const formData = new FormData();
      
      // Add all blog form fields to the form data
      formData.append('title', blogForm.title);
      formData.append('description', blogForm.description);
      
      // Ensure content is properly formatted as HTML if it's not already
      const content = containsHtml(blogForm.content) 
        ? blogForm.content 
        : plainTextToHtml(blogForm.content);
      formData.append('content', content);
      
      // Generate a slug if not provided
      const slug = blogForm.slug || blogForm.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
      formData.append('slug', slug);
      
      formData.append('readTime', blogForm.readTime);
      formData.append('published', blogForm.published.toString());
      formData.append('featured', blogForm.featured.toString());
      
      // If we have a new image file, upload it to Cloudinary first
      if (blogImageFile) {
        try {
          console.log('Uploading blog image to Cloudinary...');
          const uploadResult = await uploadToCloudinary(blogImageFile, 'blogs');
          console.log('Cloudinary upload result:', uploadResult);
          
          if (!uploadResult.url || !uploadResult.public_id) {
            throw new Error('Invalid Cloudinary upload result');
          }
          
          formData.append('img', uploadResult.url);
          formData.append('cloudinary_id', uploadResult.public_id);
        } catch (uploadError) {
          console.error('Error uploading image to Cloudinary:', uploadError);
          alert('Failed to upload image. Please try again.');
          return;
        }
      } else if (editMode && blogImagePreview) {
        // If editing and using existing image, add it to form data
        console.log('Using existing image URL:', blogImagePreview);
        formData.append('img', blogImagePreview);
      }
      
      // Log what we're sending to the API
      console.log('Submitting blog with form data:', Object.fromEntries(formData));
      
      // Create or update blog
      const response = await fetch(
        editMode ? `/api/admin/blogs/${currentItemId}` : '/api/admin/blogs',
        {
          method: editMode ? 'PUT' : 'POST',
          body: formData // Send as formData instead of JSON
        }
      );
      
      // Check for non-JSON responses
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned a non-JSON response');
      }
      
      if (response.ok) {
        // Refresh blogs list
        fetchBlogs();
        setShowBlogModal(false);
        setBlogImageFile(null);
        setBlogImagePreview('');
      } else {
        console.error('API error:', data);
        alert(data.error || 'Failed to save blog');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('An error occurred while saving the blog: ' + error.message);
    }
  };

  // Handle blog deletion
  const handleDeleteBlog = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const response = await fetch(`/api/admin/blogs/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchBlogs();
        } else {
          const data = await response.json();
          alert(data.error || 'Failed to delete blog');
        }
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('An error occurred while deleting the blog');
      }
    }
  };

  // Handle banner settings form change
  const handleBannerSettingsChange = (e) => {
    const { name, value } = e.target;
    setBannerSettings(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'originalPrice' ? Number(value) : value
    }));
  };

  // Handle banner settings update
  const handleUpdateBannerSettings = async (e) => {
    e.preventDefault();
    
    try {
      // Extract only the necessary fields to avoid sending the entire MongoDB document
      const { description, price, originalPrice } = bannerSettings;
      const dataToSend = {
        description, 
        price: Number(price), 
        originalPrice: Number(originalPrice)
      };
      
      console.log("Sending banner data:", dataToSend);
      
      // Use POST with _method=put instead of PUT for better Vercel compatibility
      const response = await fetch('/api/banner-settings?_method=put', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      
      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from API:", errorText);
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        alert('Banner updated successfully!');
        // Extract only the needed fields from the response
        const updatedSettings = data.bannerSettings;
        setBannerSettings({
          description: updatedSettings.description,
          price: updatedSettings.price,
          originalPrice: updatedSettings.originalPrice,
          // Preserve other fields that might be necessary for the UI
          ...Object.fromEntries(
            Object.entries(bannerSettings).filter(([key]) => 
              !['description', 'price', 'originalPrice'].includes(key)
            )
          )
        });
      } else {
        alert('Failed to update banner: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      alert('Error updating banner: ' + error.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        
        {/* User welcome card */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-semibold">Welcome, {user.name || user.username}</h2>
          <button 
            onClick={() => {
              localStorage.removeItem('user');
              router.push('/login');
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex border-b mb-6">
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'subscriptions' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            onClick={() => setActiveTab('subscriptions')}
          >
            Subscription Plans
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'videos' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            onClick={() => setActiveTab('videos')}
          >
            Home Videos
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'blogs' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            onClick={() => setActiveTab('blogs')}
          >
            Blogs
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'bannerSettings' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            onClick={() => setActiveTab('bannerSettings')}
          >
            Offer Banner
          </button>
        </div>
        
        {/* Subscription Plans Section */}
        {activeTab === 'subscriptions' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Subscription Plans</h2>
              <button 
                onClick={handleAddSubscription}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md"
              >
                Add New Plan
              </button>
            </div>
            
            {loadingSubscriptions ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptions.length === 0 ? (
                  <div className="col-span-3 bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-500">No subscription plans available.</p>
                  </div>
                ) : (
                  subscriptions.map(plan => (
                    <div key={plan.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col h-[400px] min-h-0">
                      <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                      <p className="text-xl text-primary font-bold mb-2">{plan.price}</p>
                      <div className="flex-1 min-h-0 overflow-y-auto">
                        {plan.description && (
                          <p className="text-gray-600">{plan.description}</p>
                        )}
                        <ul>
                          {plan.features.map((feature, index) => (
                            feature && <li key={index} className="flex items-center text-sm">
                              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex space-x-2 mt-auto">
                        <button 
                          onClick={() => handleEditSubscription(plan)}
                          className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded-md text-sm"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteSubscription(plan.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Reviews Section */}
        {activeTab === 'reviews' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Reviews</h2>
              <button 
                onClick={handleAddReview}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md"
              >
                Add New Review
              </button>
            </div>
            
            {loadingReviews ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-500">No reviews available.</p>
                  </div>
                ) : (
                  reviews.map(review => (
                    <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold">{review.name}</h3>
                        <div className="flex">
                          {[...Array(5)].map((_, index) => (
                            <svg 
                              key={index} 
                              className={`h-5 w-5 ${index < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-4 mb-3">
                        {review.img && (
                          <div className="flex-shrink-0">
                            <img 
                              src={review.img} 
                              alt={review.name} 
                              className="w-24 h-24 object-cover rounded"
                            />
                          </div>
                        )}
                        <div className="flex-grow">
                          <p className="text-gray-700">{review.review}</p>
                          {review.url && (
                            <a 
                              href={review.url}
                              target="_blank"
                              rel="noopener noreferrer" 
                              className="text-primary hover:underline text-sm mt-1 inline-block"
                            >
                              View Source
                            </a>
                          )}
                        </div>
                      </div>
                      {review.email && <p className="text-sm text-gray-500 mt-1">Email: {review.email}</p>}
                      {review.createdAt && <p className="text-sm text-gray-500 mt-1">
                        Date: {new Date(review.createdAt).toLocaleDateString()}
                      </p>}
                      <div className="flex space-x-2 mt-3">
                        <button 
                          onClick={() => handleEditReview(review)}
                          className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded-md text-sm"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteReview(review._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Home Videos Section */}
        {activeTab === 'videos' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Home Videos</h2>
              <button 
                onClick={handleAddVideo}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md"
              >
                Add New Video
              </button>
            </div>
            
            {loadingVideos ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {videos.length === 0 ? (
                  <div className="col-span-3 bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-500">No videos available.</p>
                  </div>
                ) : (
                  videos.map(video => (
                    <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="bg-gray-200 h-40 relative">
                        {video.thumbnail ? (
                          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{video.title}</h3>
                        {video.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>
                        )}
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditVideo(video)}
                            className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded-md text-sm"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteVideo(video.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Add Blogs Section after the Videos Section */}
        {activeTab === 'blogs' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Blogs</h2>
              <button 
                onClick={handleAddBlog}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md"
              >
                Add New Blog
              </button>
            </div>
            
            {loadingBlogs ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {blogs.length === 0 ? (
                  <div className="col-span-3 bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-500">No blogs available.</p>
                  </div>
                ) : (
                  blogs.map(blog => (
                    <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="bg-gray-200 h-40 relative">
                        {blog.slug ? (
                          <img 
                            src={blog.img || `/api/blogs/${blog.slug}/image`} 
                            alt={blog.title} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex space-x-2">
                          {blog.featured && (
                            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                              Featured
                            </span>
                          )}
                          {!blog.published && (
                            <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">
                              Draft
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          {blog.readTime}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{blog.title}</h3>
                        {blog.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{blog.description}</p>
                        )}
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditBlog(blog)}
                            className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded-md text-sm"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteBlog(blog._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Banner Settings Section */}
        {activeTab === 'bannerSettings' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Offer Banner</h2>
            </div>
            
            {loadingBannerSettings ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleUpdateBannerSettings}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                      Banner Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={bannerSettings.description}
                      onChange={handleBannerSettingsChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      rows="4"
                      autoCapitalize="on"
                      maxLength={150}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                     Discounted Price (Rs)
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      value={bannerSettings.price}
                      onChange={handleBannerSettingsChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="originalPrice">
                      Original Price (Rs)
                    </label>
                    <input
                      id="originalPrice"
                      name="originalPrice"
                      type="number"
                      value={bannerSettings.originalPrice}
                      onChange={handleBannerSettingsChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center justify-end">
                    <button
                      type="submit"
                      className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Update 
                    </button>
                  </div>
                </form>
                
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Preview</h3>
                  <div className="bg-primary text-white p-4 rounded">
                    <p className="text-lg leading-[1.5]">
                      {bannerSettings.description}{" "}
                      <span className="font-medium">
                        (Offered Price {bannerSettings.price}RS -{" "}
                        <span className="line-through">{bannerSettings.originalPrice}RS</span>)
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Add Blog Modal after other modals */}
      {showBlogModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">{editMode ? 'Edit Blog' : 'Add New Blog'}</h2>
            <form onSubmit={handleSubmitBlog}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={blogForm.title} 
                  onChange={handleBlogFormChange}
                  className="w-full p-2 border rounded" 
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL path)</label>
                <input 
                  type="text" 
                  name="slug" 
                  value={blogForm.slug} 
                  onChange={handleBlogFormChange}
                  placeholder="my-blog-post (will be auto-generated if left empty)"
                  className="w-full p-2 border rounded" 
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate from title</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  name="description" 
                  value={blogForm.description} 
                  onChange={handleBlogFormChange}
                  className="w-full p-2 border rounded" 
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <RichTextEditor 
                  value={blogForm.content} 
                  onChange={(content) => setBlogForm(prev => ({ ...prev, content }))}
                  placeholder="Write your blog content here..."
                />
                <button
                  type="button"
                  onClick={() => {
                    if (containsHtml(blogForm.content)) {
                      const plainText = htmlToPlainText(blogForm.content);
                      setBlogForm(prev => ({ ...prev, content: plainText }));
                    }
                  }}
                  className="mt-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 rounded"
                >
                  Convert to Plain Text
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blog Image {!editMode && <span className="text-red-500">*</span>}
                </label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleBlogImageChange}
                  className="w-full p-2 border rounded" 
                  required={!editMode}
                />
                <p className="text-xs text-amber-600 mt-1">⚠️ Image must be less than 4MB </p>
                {!editMode && !blogImageFile && (
                  <p className="text-sm text-red-500 mt-1">Image is required for new blogs</p>
                )}
                {blogImagePreview && (
                  <div className="mt-2 relative w-full h-40">
                    <img 
                      src={blogImagePreview} 
                      alt="Blog preview" 
                      className="w-full h-full object-cover rounded" 
                    />
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Read Time (e.g. "5 min")</label>
                <input 
                  type="text" 
                  name="readTime" 
                  value={blogForm.readTime} 
                  onChange={handleBlogFormChange}
                  className="w-full p-2 border rounded" 
                  required
                />
              </div>
              <div className="flex mb-4 space-x-6">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="published"
                    name="published" 
                    checked={blogForm.published} 
                    onChange={handleBlogFormChange}
                    className="mr-2" 
                  />
                  <label htmlFor="published" className="text-sm font-medium text-gray-700">Published</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="featured"
                    name="featured" 
                    checked={blogForm.featured} 
                    onChange={handleBlogFormChange}
                    className="mr-2" 
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured</label>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md"
                >
                  {editMode ? 'Update Blog' : 'Create Blog'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowBlogModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Existing modals */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">{editMode ? 'Edit Subscription' : 'Add New Subscription'}</h2>
            <form onSubmit={handleSubmitSubscription}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={subscriptionForm.name} 
                  onChange={handleSubscriptionFormChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <RichTextEditor 
                  value={subscriptionForm.description} 
                  onChange={(content) => setSubscriptionForm(prev => ({ ...prev, description: content }))}
                  placeholder="Write subscription description here..."
                />
                <button
                  type="button"
                  onClick={() => {
                    if (containsHtml(subscriptionForm.description)) {
                      const plainText = htmlToPlainText(subscriptionForm.description);
                      setSubscriptionForm(prev => ({ ...prev, description: plainText }));
                    }
                  }}
                  className="mt-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 rounded"
                >
                  Convert to Plain Text
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input 
                  type="file" 
                  onChange={handleSubImageChange}
                  className="w-full" 
                  accept="image/*" 
                />
                <p className="text-xs text-amber-600 mt-1">⚠️ Image must be less than 4MB </p>
                {subImagePreview && (
                  <div className="mt-2 relative h-40 w-full">
                    <img 
                      src={subImagePreview} 
                      alt="Subscription preview" 
                      className="h-40 object-cover rounded-md" 
                    />
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fee (₹)</label>
                <input 
                  type="number" 
                  name="fee" 
                  value={subscriptionForm.fee} 
                  onChange={handleSubscriptionFormChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input 
                  type="text" 
                  name="duration" 
                  value={subscriptionForm.duration} 
                  onChange={handleSubscriptionFormChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="e.g. 3 days (6 sessions)"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  {editMode ? 'Update Subscription' : 'Create Subscription'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowSubscriptionModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">{editMode ? 'Edit Video' : 'Add New Video'}</h2>
            <form onSubmit={handleSubmitVideo}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={videoForm.title} 
                  onChange={handleVideoFormChange}
                  className="w-full p-2 border rounded" 
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  name="description" 
                  value={videoForm.description} 
                  onChange={handleVideoFormChange}
                  className="w-full p-2 border rounded" 
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image <span className="text-red-500">*</span></label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 border rounded" 
                  required={!editMode || !videoForm.img}
                />
                <p className="text-xs text-amber-600 mt-1">⚠️ Image must be less than 4MB </p>
                {!imageFile && !imagePreview && !editMode && (
                  <p className="text-sm text-red-500 mt-1">An image is required for the video thumbnail</p>
                )}
                {imagePreview && (
                  <div className="mt-2 relative w-full h-40">
                    <img 
                      src={imagePreview} 
                      alt="Video preview" 
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input 
                  type="text" 
                  name="url" 
                  value={videoForm.url} 
                  onChange={handleVideoFormChange}
                  className="w-full p-2 border rounded" 
                  required
                />
              </div>
              <div className="flex space-x-2">
                <button 
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md"
                >
                  {editMode ? 'Update Video' : 'Create Video'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">{editMode ? 'Edit Review' : 'Add New Review'}</h2>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name of Reviewer</label>
                <input 
                  type="text" 
                  name="name" 
                  value={reviewForm.name} 
                  onChange={handleReviewFormChange}
                  className="w-full p-2 border rounded" 
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <select 
                  name="rating" 
                  value={reviewForm.rating} 
                  onChange={handleReviewFormChange}
                  className="w-full p-2 border rounded" 
                  required
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Review Content</label>
                <textarea 
                  name="review" 
                  value={reviewForm.review} 
                  onChange={handleReviewFormChange}
                  className="w-full p-2 border rounded" 
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reviewer Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleReviewImageChange}
                  className="w-full p-2 border rounded" 
                />
                <p className="text-xs text-amber-600 mt-1">⚠️ Image must be less than 4MB </p>
                {reviewImagePreview && (
                  <div className="mt-2">
                    <img src={reviewImagePreview} alt="Preview" className="w-32 h-32 object-cover rounded" />
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <button 
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md"
                >
                  {editMode ? 'Update Review' : 'Create Review'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}