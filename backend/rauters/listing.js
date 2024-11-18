const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/warpAsync.js")
const { isAuthenticated ,isowner,listingvalidate } = require('../utils/Middleware.js'); 
const listingcontroller = require('../Controller/listing.js')
const multer = require('multer')
const { storage } = require('../ThirdParty/cludynaryconfig.js');
const upload = multer({ storage });
// Index route

router.route('/')
    .get( wrapAsync(listingcontroller.index))
 .post(isAuthenticated, upload.single('image'), wrapAsync(listingcontroller.createPost));

    
// Create route
router.get('/create', isAuthenticated, listingcontroller.create);



// Show route
router.route('/:id')
    .get(wrapAsync(listingcontroller.showPost))
     .put(isAuthenticated, isowner,upload.single('listing[image]'), wrapAsync(listingcontroller.postUpdate))
    .delete(isAuthenticated, isowner, wrapAsync(listingcontroller.postDelete))
    

// Edit route
router.get('/:id/edit',isAuthenticated,isowner, wrapAsync(listingcontroller.editPost));

module.exports = router;