const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cloudinary configuration
cloudinary.config({
    cloud_name: "dofrgw7vf",
    api_key: "616383583399284",
    api_secret: "IKstWUI_QaNhYG25M0Kpb1lvlmU",
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
        console.log('No image to delete.');
    }
};

module.exports = {
    upload,
  cloudinary,
 deleteImage,
    
};
