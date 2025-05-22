import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file to Cloudinary
 * @param {File|Buffer|string} file - The file to upload (can be a File object, Buffer, or base64 string)
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - The Cloudinary upload result
 */
export const uploadToCloudinary = async (file, options = {}) => {
  try {
    // If file is already a string (URL or base64), use it directly
    if (typeof file === 'string' && (file.startsWith('data:') || file.startsWith('http'))) {
      return await cloudinary.uploader.upload(file, {
        folder: 'conscious-namaz',
        ...options
      });
    }
    
    // If it's a File object from formData, convert to buffer then base64
    if (file instanceof File || file instanceof Blob) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileStr = buffer.toString('base64');
      const base64File = `data:${file.type};base64,${fileStr}`;
      
      return await cloudinary.uploader.upload(base64File, {
        folder: 'conscious-namaz',
        ...options
      });
    }
    
    // If it's already a buffer
    if (Buffer.isBuffer(file)) {
      const fileStr = file.toString('base64');
      return await cloudinary.uploader.upload(`data:image;base64,${fileStr}`, {
        folder: 'conscious-namaz',
        resource_type: 'auto',
        ...options
      });
    }
    
    throw new Error('Invalid file format for Cloudinary upload');
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

/**
 * Delete a file from Cloudinary by public_id
 * @param {string} publicId - The public_id of the image to delete
 * @returns {Promise<Object>} - The Cloudinary deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

export default cloudinary; 