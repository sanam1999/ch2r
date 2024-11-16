const Listing = require('../models/listing.js')
const User = require('../models/user.js')
const Token = require('../models/token.js')
const ExpressError = require("./ExpressError.js")
const { ListingSchema, reviewShema } = require('./shema.js'); 
const Revies = require('../models/review.js');
const { AccountVerification } = require('../ThirdParty/nodemiler.js');


module.exports.isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.url = req.originalUrl;
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect('/login'); 
    } 
    next(); 
};
module.exports.saveURL = (req, res, next) => {
    if (req.session.url) {
        res.locals.url = req.session.url;
    }
    next();
};
module.exports.isowner = async (req, res, next) => {
     const { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.curUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`)
    }
    next();
}
module.exports.listingvalidate = (req, res, next) => {
    const { error } = ListingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400,errMsg)
    } else {
        next();
    }
};
module.exports.validatereview = (req, res, next) => {
    const { error } = reviewShema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } 
    next();
};
module.exports.isOeviewOwner = async (req, res, next) => {
     const { rid ,id} = req.params;
    let revies = await Revies.findById(rid);
    if (!revies.author._id.equals(res.locals.curUser._id)) {
        req.flash("error", "You are not the author of this revies");
        return res.redirect(`/listings/${id}`)
    }
    next();
}
module.exports.isboarMember = async (req, res, next) => {
    const { role } = req.user;
    if (role !== "boarMember" && role !== "admin") {
        req.flash("error", "Request denied");
        return res.redirect(`/event`);
    }
    next();
}
module.exports.verified = async (req, res, next) => {
    const { role } = req.user;
    if (role !== "verified") {
        req.flash("error", "Request denied");
        return res.redirect(`/event`);
    }
    next();
}
module.exports.isActivate = async (req, res, next) => {
    try {
    
        const user = await User.findByUsername(req.body.username);
        const token = await Token.findOne({ Email: req.body.username });
        if (!user.accStatus) {
            if (token) {
                req.flash("error", "You are not verified. Please check your email.");
            } else {
                 let token = new Token({  
                     Email: req.body.username,
               });
                    token = await token.save();
                    AccountVerification(token._id, user._id, user.username, user.name);
                    req.flash("error", "Your token has expired. We sent a new token. Please check your email.");
            }
            return res.redirect('/login');
        }
        next();
    } catch (error) {
         next();
    }
};
