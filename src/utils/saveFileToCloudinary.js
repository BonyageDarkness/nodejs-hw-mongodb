// src/utils/saveFileToCloudinary.js
import cloudinary from 'cloudinary';
import fs from 'fs/promises';
import { CLOUDINARY } from '../constants/index.js';
import { env } from './env.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: env(CLOUDINARY.CLOUD_NAME),
  api_key: env(CLOUDINARY.API_KEY),
  api_secret: env(CLOUDINARY.API_SECRET),
});

// src/utils/saveFileToCloudinary.js

export const saveFileToCloudinary = async (file) => {
  try {
    console.log('File path for Cloudinary:', file.path);
    const response = await cloudinary.v2.uploader.upload(file.path);
    console.log('Cloudinary upload response:', response);
    await fs.unlink(file.path);
    console.log('Temporary file deleted:', file.path);
    return response.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
};
