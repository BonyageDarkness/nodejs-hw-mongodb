// src/middlewares/multer.js
import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Saving file to TEMP_UPLOAD_DIR:', TEMP_UPLOAD_DIR);
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    console.log('Generated file name:', uniqueSuffix);
    cb(null, uniqueSuffix);
  },
});

export const upload = multer({ storage });
