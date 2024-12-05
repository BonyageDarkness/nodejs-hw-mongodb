// src/middlewares/multer.js
import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;

    cb(null, uniqueSuffix);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});
