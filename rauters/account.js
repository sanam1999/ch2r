
const express = require('express');
 const router = express.Router({mergeParams: true});
 const wrapAsync = require("../utils/warpAsync.js")
 const { isAuthenticated, isowner, listingvalidate } = require('../utils/Middleware.js'); 
const { accountGet, transaction, promotionGet, promotionPost, promotionPut, promotioncommunityMemberGet } = require("../Controller/account.js")
 

router.route('/')
    .get( wrapAsync(accountGet))
    .post(wrapAsync(transaction))
    
router.route('/communityMember')
    .get( wrapAsync(promotioncommunityMemberGet))
    

   
    
router.route('/promotion')
    .get( wrapAsync(promotionGet))
    .post(wrapAsync(promotionPost))
    .put(wrapAsync(promotionPut));
    

    
module.exports = router;