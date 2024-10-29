const express = require('express');
const warpAsync = require('../utils/warpAsync');
const passport = require('passport'); 
const {saveURL, isAuthenticated} = require('../Middleware')
const router = express.Router();
const {signupGet,signupPost,loginPost,loginGet,logout, profileGet, profilePost,editProfile} = require('../Controller/usre')


// Signup route
router.route('/signup')
    .get(signupGet)
    .post(warpAsync(signupPost));
router.route('/profile')
    .get(isAuthenticated, profileGet)
    .post(isAuthenticated, profilePost);

router.route('/profile/edit')
    .get(isAuthenticated, editProfile)
    .post(isAuthenticated, profilePost);

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

module.exports = router;