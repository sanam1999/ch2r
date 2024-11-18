const User = require("../models/user.js");
const UserInfo = require("../models/userInfo.js");
const Event = require("../models/event.js");



module.exports.index = async (req, res) => {
   
  const verifiedCount = await User.countDocuments({ role: "Verified" });
    const communityMemberCount = await User.countDocuments({ role: "communityMember" });
    const eventcount = await Event.countDocuments({});
    const Courses = 0;
   let sers = await User.find({ role: "communityMember" }).populate("userInfo");
    console.log(sers)


// console.log({ verifiedCount, communityMemberCount ,eventcount});
    res.render("home/home.ejs", { verifiedCount, communityMemberCount ,eventcount , Courses});


}


module.exports.create =(req, res) => {
    res.render("home/new.ejs");
}

module.exports.createPost = async (req, res) => {
    const { title, description, price, location, country } = req.body;
    const url = req.file.path
    const filename = req.file.filename;
    let owner = req.user._id;
    const newListing = new Listing({ title, description, price, location, country, owner });
    newListing.image = {url,filename}
    await newListing.save();
    req.flash("success", "New post created!");
    res.redirect('/listings');
}

module.exports.showPost =async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id)
        .populate({
        path: "reviews",
        populate: {
            path: "author"
        },
        })
        .populate("owner");
    if (!list) {
        req.flash("error", "This post is not available");
        return res.redirect('/listings');
    }
    
    res.render("home/show.ejs", { list });
}

module.exports.editPost = async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id);
    if (!list) {
        req.flash("error", "This post is not available");
        return res.redirect('/listings');
    }
    res.render("home/edit.ejs", { list });
}

module.exports.postUpdate = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if (req.file) {
        const url = req.file.path
        const filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Post updated successfully");
    res.redirect(`/listings/${id}`);
}
module.exports.postDelete = async (req, res) => {
    const { id } = req.params;
    
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Post deleted successfully");
    res.redirect("/listings");
}
