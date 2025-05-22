/**
 * Upload a file to Cloudinary through our API endpoint
 * @param {File} file - The file to upload
 * @param {string} folder - Optional folder name within Cloudinary
 * @returns {Promise<Object>} - The upload result with URL and public_id
 */
export const uploadToCloudinary = async (file, folder = 'conscious-namaz') => {
  try {
    if (!file) {
      throw new Error('No file provided for upload');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload image');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

/**
 * Convert a data URL to a File object
 * @param {string} dataUrl - The data URL
 * @param {string} filename - The filename to use
 * @returns {File} - The File object
 */
export const dataUrlToFile = (dataUrl, filename) => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
};

/**
 * Get the Cloudinary public ID from a URL
 * @param {string} url - The Cloudinary URL
 * @returns {string|null} - The public ID or null if not a Cloudinary URL
 */
export const getPublicIdFromUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  // Check if it's a Cloudinary URL
  if (!url.includes('cloudinary.com')) return null;
  
  try {
    // Extract the public ID from the URL
    // Format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.ext
    const urlParts = url.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    
    if (uploadIndex === -1 || uploadIndex + 2 >= urlParts.length) return null;
    
    // Remove version number if present and file extension
    const publicIdWithExt = urlParts.slice(uploadIndex + 2).join('/');
    const publicId = publicIdWithExt.split('.')[0];
    
    return publicId;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
}; 