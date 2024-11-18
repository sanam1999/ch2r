const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cloudinary configuration
cloudinary.config({
    cloud_name:  process.env.cloud_name ,
    api_key:process.env.api_key  ,
    api_secret: process.env.api_secret,
});

// Define the storage configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'event',
        allowed_formats: ["png", "jpg", "jpeg"], // Corrected the typo to `allowed_formats`
    },
});

// Initialize multer with the storage
const upload = multer({ storage });
async function deleteImage(imageToDelete) {
    if (imageToDelete && imageToDelete.filename) {
        try {
            await cloudinary.uploader.destroy(imageToDelete.filename);
        } catch (error) {
            res.status(400).json({ message: 'Failed to delete image:', error: error.message });
        }
    } else {
        res.status(400).json({ message: 'No image to delete. '});
    }
};

module.exports = {
    upload,
  cloudinary,
 deleteImage,
    
};
