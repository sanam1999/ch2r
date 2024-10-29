const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: "dofrgw7vf",
    api_key: "616383583399284",
    api_secret: "IKstWUI_QaNhYG25M0Kpb1lvlmU",
})
console.log("fasdfasd");
const storage = new CloudinaryStorage({

  cloudinary: cloudinary,
  params: {
    folder: 'losting_img',
    aloudegform: ["png","jpg","jpeg"],
  },
});
 
module.exports = {
    storage,
    cloudinary,
}