const Account = require('../models/account.js');
const User = require('../models/user.js');
const Userinfo = require('../models/userInfo.js')
module.exports.transaction = async (req, res) => {
    const transactionType = req.body.type === "deposit" ? "deposit" : "withdrawal";
    try {
       const account = await Account.findOne();       
        if (transactionType === "deposit") {
            await account.addTransaction(transactionType, Number(req.body.amount), req.body.purpose);
            req.flash('success', 'Deposit successful');
        } else {
            if (account.balance < req.body.amount) {
                req.flash('error', 'Insufficient balance for withdrawal');
                return res.redirect('/account');
            }
            await account.addTransaction(transactionType, Number(req.body.amount), req.body.purpose);
            req.flash('success', 'Withdrawal successful');
        }
        return res.redirect('/account');
    } catch (error) {
        console.error("Transaction error:", error);
        req.flash('error', 'Transaction failed');
        return res.redirect('/account');
    }
};
module.exports.accountGet = async (req, res) => {
    try {
        const account = await Account.find(); 
        return res.render("account/accounts.ejs", { acc: account[0].balance, details: account[0].transactions });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error fetching account');
        return res.redirect('/error');
    }
}
module.exports.promotionGet = async (req, res) => {
    try {
        const users = await User.find({});
       
        return res.render("account/promotion.ejs", { users  });
    } catch (err) {
        console.error(err);
        req.flash("error", "Error fetching account");
        return res.redirect("/error");
    }
};
module.exports.promotioncommunityMemberGet = async (req, res) => {
    try {
         await Userinfo.findOneAndUpdate(
            { _id: "6728841bb3fd88079262c69e" }, // Use an object as the filter
            { team: "Top Board" }
         );       
        let respost;
        // Base query to find community members
        const query = { role: "communityMember" };

        // If 'type' query parameter is present, add conditions
        if (req.query.type) {
            // Assuming 'type' corresponds to a team name or role
            query['teams.teamName'] = req.query.type; // Filter by team name
        }

        // Fetch users based on the constructed query and populate userInfo
        respost = await User.find(query).populate('userInfo');

        // Return the results
        res.json(respost);
        
    } catch (err) {
        console.error(err);
        return res.json({ error: "user not found" });
    }
};
module.exports.promotionPost = async (req, res) => {
    try {
        let users;
        if (req.body.type == "role") {
            if (req.body.value == "all") {
                users = await User.find({});
            } else {
                users = await User.find({ role: req.body.value });
            }
        } else {
           const searchValue = req.body.value; // Get the value from the request body
users = await User.find({
    $or: [
        { name: { $regex: searchValue, $options: 'i' } }, // 'i' for case-insensitive
        { username: { $regex: searchValue, $options: 'i' } }
    ]
});
        }
      return res.json(users )
    } catch (err) {
        console.error(err);
        req.flash("error", "Error fetching account");
        return res.redirect("/error");
    }
};
module.exports.promotionPut = async (req, res) => {
   
    try {
        let account = await User.findById(req.body.userId)
        if (account.role == req.body.action) {
            return res.status(401).json({ message: 'unexpected error' });
        }
        if (req.body.action == "Verified") {
            const account = await Account.findOne();
            await account.addTransaction("deposit", Number(500), "Registration Fee");
        } else if(req.body.action == "Unverified"){
             const account = await Account.findOne();
            await account.addTransaction("withdrawal", Number(500), "Cencel Registration");
        }


        let updatedUser;
        if (req.body.action == "demotedboardmember") {
            req.body.action=="Verified"
        }
        if (req.body.action === "deletedaccount") {
            const deletedUser = await User.findByIdAndDelete(req.body.userId);
            updatedUser = await Userinfo.findByIdAndDelete(deletedUser.userInfo);
            
        } else {
            if (req.body.action=="communityMember") {
               
                if(account.role != "Verified") {
                   return res.status(401).json({ message: 'First, verify user' });
                }
            }
                updatedUser = await User.findByIdAndUpdate(
                    req.body.userId,
                    { role: req.body.action },
                    { new: true }
                );
        }
        return res.json(updatedUser);
    } catch (err) {
        console.error(err);
        req.flash("error", "Error fetching account");
        return res.redirect("/error");
    }
};




