const express = require('express');
const router = express.Router({mergeParams: true});
const warpAsync = require('../utils/warpAsync');
const passport = require('passport'); 
const {saveURL, isAuthenticated, isActivate} = require('../utils/Middleware.js')

const { signupGet, signupPost, loginPost, loginGet, logout, profileGet,profilePost, editProfile, profileIMGupdate, loginacc, Subscribe, verifid } = require('../Controller/usre')
const { upload } = require("../ThirdParty/cludynaryconfig.js");

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
    

router.route('/login')
    .post(
        saveURL,
        isActivate,
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

router.route('/Subscribe')
    .post(Subscribe);

router.route('/verifid')
    .get(verifid)



module.exports = router;