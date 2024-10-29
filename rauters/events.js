
const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/warpAsync.js")
const { isAuthenticated, isowner, listingvalidate } = require('../Middleware.js'); 
const {eventAdd, eventGet,eventPost} = require("../Controller/event.js")
const multer = require('multer')
const { storage } = require('../cludynaryconfig.js');
const upload = multer({ storage });

router.route('/')
    .get( wrapAsync(eventGet))
    .post(eventPost)
    
router.route('/addevent')
   .get(eventAdd)
    // .post(isAuthenticated, upload.single('image'), wrapAsync());

    
module.exports = router;