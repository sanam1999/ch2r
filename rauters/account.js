
const express = require('express');
 const router = express.Router({mergeParams: true});
 const wrapAsync = require("../utils/warpAsync.js")
 const { isAuthenticated, isowner, listingvalidate } = require('../Middleware.js'); 
 const {accountGet,transaction,promotionGet,promotionPost,promotionPut} = require("../Controller/account.js")

router.route('/')
    .get( wrapAsync(accountGet))
    .post(wrapAsync(transaction));
    

router.route('/promotion')
    .get( wrapAsync(promotionGet))
     .post(wrapAsync(promotionPost))
     .put(wrapAsync(promotionPut));
    

    
module.exports = router;