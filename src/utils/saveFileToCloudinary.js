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

export const saveFileToCloudinary = async (file) => {
  console.log('--- Starting Cloudinary Upload ---');
  console.log('Environment Variables:');
  console.log({
    CLOUD_NAME: env(CLOUDINARY.CLOUD_NAME),
    API_KEY: env(CLOUDINARY.API_KEY),
    API_SECRET: env(CLOUDINARY.API_SECRET) ? '*****' : null, // скрываем секрет
  });

  console.log('File details received:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    path: file.path,
  });

  try {
    console.log('Uploading file to Cloudinary:', file.path);
    const response = await cloudinary.v2.uploader.upload(file.path);

    console.log('Cloudinary upload successful. Response:');
    console.log(response);

    console.log('Deleting temporary file:', file.path);
    await fs.unlink(file.path);

    console.log('Temporary file successfully deleted:', file.path);
    console.log('--- Cloudinary Upload Completed ---');

    return response.secure_url;
  } catch (error) {
    console.error('Error during Cloudinary upload:');
    console.error('File Path:', file.path);
    console.error('Error details:', error.message);
    console.error('Full error object:', error);

    throw new Error('Failed to upload file to Cloudinary');
  }
};
