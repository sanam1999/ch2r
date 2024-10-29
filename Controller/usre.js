const User = require("../models/user");
const UserInfo = require("../models/userInfo");

module.exports.signupGet = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signupPost = async (req, res) => {
    try {
        let userInfo = new UserInfo();
       userInfo = await userInfo.save();
        let newuser = new User({
           name: req.body.user.name,
           username: req.body.user.username,
           userInfo: userInfo._id,
        }
        );
       
        
        let registeredUser = await User.register(newuser, req.body.user.password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', `Welcome ${newuser.name}`);
            res.redirect('/listings');
        }); 
       
    } catch (err) {
        req.flash("error", err.message);
        res.redirect('/signup');
    }
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
        res.redirect('/listings')
    })
}
module.exports.profileGet = async (req, res, next) => {
    let userInf;
    try {
        console.log(req.user.username);
     userInf = await User.findById(req.user._id).populate('userInfo'); // Lowercase 'userInfo'

        
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
       
     await UserInfo.findByIdAndUpdate(req.user.userInfo,req.body);

    
            return res.redirect("/profile");
        
    } catch (error) {
        req.flash("error", error.message);
        return next(error);
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