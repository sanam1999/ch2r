const User = require("../models/user");
const UserInfo = require("../models/userInfo");
const { subscribeUser } = require("../models/Subscribe");
const { deleteImage } = require("../ThirdParty/cludynaryconfig.js");
const { AccountVerification } = require('../ThirdParty/nodemiler.js');
const Token = require('../models/token')


module.exports.signupPost = async (req, res) => {
    try {
        let userInfo = new UserInfo();
        userInfo = await userInfo.save();
        const name = req.body.user.name;
        const email = req.body.user.username;
        let newuser = new User({
           name: name,
           username: email,
           userInfo: userInfo._id,
        });      
     
    newuser = await User.register(newuser, req.body.user.password);
        newuser = await newuser.save();
        let token = new Token({  
            Email: req.body.user.username,
        });
       token = await token.save();
        AccountVerification(token._id, newuser._id, email, name);
        req.flash("success", "An email has been sent to your Gmail please verify.");
        res.redirect('/login');
    } catch (err) {
        req.flash("error", err.message);
        res.redirect('/signup');
    }


}
module.exports.signupGet = (req, res) => {
    res.render("users/signup.ejs");
}
module.exports.loginPost = async (req, res) => {
            req.flash("success", `Welcome ${req.user.name}`);
            let url = res.locals.url || '/listings'
            res.redirect(url);
}
module.exports.loginGet =  (req, res) => {
    res.render("users/login.ejs");
}
module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
           return next(err);
        }
        req.flash("success", "you are logged out");
        res.redirect('/login')
    })
}
module.exports.profileGet = async (req, res, next) => {
    let userInf;
    try {
        
     userInf = await User.findById(req.user._id).populate('userInfo');
        if (!userInf) {
            req.flash("success", "Complid your profile");
            
        }
       
    } catch (error) {
        req.flash("error", error.message);
        return next(error); 
    }
   
     res.render("users/profile.ejs", { user: userInf });
};
module.exports.profilePost = async (req, res, next) => {
    try {
        
        await UserInfo.findByIdAndUpdate(req.user.userInfo, {
            ...req.body,
            address: {
                street: req.body.street,
                city: req.body.city,
            },
            socialMedia: {
                linkedin: req.body.linkedin || "",
                facebook: req.body.facebook || "",
                X: req.body.X || "",
            }
        });

        return res.redirect("/profile");
        
    } catch (error) {
        req.flash("error", error.message);
        return next(error);
    }
};
module.exports.profileIMGupdate = async (req, res, next) => {
    try {
        if (req.file) {
            let user = await User.findById(req.user._id).populate('userInfo');
        
            if (user.userInfo.img.filename !== "1") {
                deleteImage(user.userInfo.img);
            }
            await UserInfo.findByIdAndUpdate(user.userInfo._id, {
                'img.url': req.file.path,
                'img.filename': req.file.filename,
            });
          
        }
          res.status(200).json({ message: 'Profile image updated successfully.' });
    } catch (error) {
        req.flash("error", error.message);
         res.status(501).json({ message: error.message });
    }
};
module.exports.loginacc = async (req, res) => {
    try {
        if (req.user !== undefined) {
            let account = await User.findById(req.user._id).populate('userInfo');
            return res.status(200).json({ name: account.name, img: account.userInfo.img.url });
        } 
        return;
    } catch (err) {
        console.error(err);
        req.flash("error", "Error fetching account");
        return res.redirect("/error");
    }
};
module.exports.editProfile = async (req, res, next) => {
    let userInfo;
    try {
    userInfo = await User.findById(req.user._id).populate('userInfo');
        if (!userInfo) {
            req.flash("success", "Complid your profile");   
        }
    } catch (error) {
        req.flash("error", error.message);
        return next(error); 
    }
    res.render("users/editProfile.ejs", {user: userInfo.userInfo });
};
module.exports.Subscribe = async (req, res) => {
try{
    const msg = await subscribeUser(req.body.email)
 res.status(200).json({ message: msg.message });
  } catch (err) {
    console.error('Error deleting image:', err.message);
    res.status(500).json({ message: err});
  }
   
}
module.exports.verifid = async (req, res) => {
    try {
        const { userid, token, email } = req.query;
        console.log(userid, token, email)
       let user =  await User.findByUsername(email);
     
        if (user.accStatus) {
            req.flash("success", "Your account is already verified.");
         return   res.redirect('/login');
            
}
        let Tken = await Token.findById(token);
        console.log(Tken)
        if (Tken && Tken.Email === email) {
            await User.findByIdAndUpdate(userid, { accStatus: true });
          await  Token.findByIdAndDelete(Tken._id);
         req.flash("success", "Welcome! Your account is verified");
        } else {
            req.flash("error", "Invalid token for user verification");
        }
    } catch (err) {
       
      req.flash("error", "This token has expired. Please log in to receive a new token.");
    }
 res.redirect('/login');

};
