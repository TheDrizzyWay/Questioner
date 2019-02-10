import multer from 'multer';
import cloudinary from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import { errorResponse } from '../utils/responses';

dotenv.config();

cloudinary.config({
  cloudinary_name: process.env.CLOUDINARY_URL,
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: 'questioner',
  allowedFormats: ['jpg', 'jpeg', 'png'],
  transformation: [{
    width: 500, height: 500, crop: 'limit',
  }],
});

const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
}).single('image');

const imageUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return errorResponse(res, 400, err.message);
    }
    return next();
  });
};

export default imageUpload;
