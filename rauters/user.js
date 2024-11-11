const express = require('express');
const warpAsync = require('../utils/warpAsync');
const passport = require('passport'); 
const {saveURL, isAuthenticated} = require('../Middleware')
const router = express.Router();
const {signupGet,signupPost,loginPost,loginGet,logout, profileGet, profilePost,editProfile,profileIMGupdate,loginacc} = require('../Controller/usre')
const { upload } = require("../cludynaryconfig.js");

// Signup route
router.route('/signup')
    .get(signupGet)
    .post(warpAsync(signupPost));
router.route('/profile')
    .get(isAuthenticated, profileGet)
    .post(isAuthenticated, profilePost);

router.route('/profile/edit')
    .get(isAuthenticated, editProfile)
    .post(isAuthenticated, profilePost)
    .put(upload.single('profileImg'), profileIMGupdate)
    

// Login route
router.route('/login')
    .post(
    saveURL,
    passport.authenticate(
    "local", { 
    failureRedirect: '/login', 
        failureFlash: true
    }),
    warpAsync(loginPost)
    )
    .get(loginGet);

// Login route
router.get("/logout", logout)

     
router.route('/getUserinfo')
    .get(loginacc);


module.exports = router;