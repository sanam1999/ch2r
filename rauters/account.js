
const express = require('express');
 const router = express.Router({mergeParams: true});
 const wrapAsync = require("../utils/warpAsync.js")
 const { isAuthenticated, isowner, listingvalidate } = require('../Middleware.js'); 
 const {accountGet,transaction} = require("../Controller/account.js")

router.route('/')
    .get( wrapAsync(accountGet))
    .post(wrapAsync(transaction));
    

    
module.exports = router;