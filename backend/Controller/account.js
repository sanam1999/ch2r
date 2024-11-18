const Account = require('../models/account.js');
const User = require('../models/user.js');
const userInfo = require('../models/userInfo.js');
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
        const users = await User.find({}).populate("userInfo");
       
        return res.render("account/promotion.ejs", { users  });
    } catch (err) {
        console.error(err);
        req.flash("error", "Error fetching account");
        return res.redirect("/error");
    }
};

module.exports.promotioncommunityMemberGet = async (req, res) => {
    try {
        let { department, role, id, type } = req.body; 
        console.log(department, role, id, type);  
        let Usero = await Userinfo.findById(id);

        if (!Usero) {
            return res.status(404).json({ error: "User not found." });
        }

        if (type === "remove") {
            let found = false;

            // Iterate through user's teams to find and remove the correct role
            for (const userTeam of Usero.teams) {
                if (userTeam.teamName === department && userTeam.roles === role) {
                    found = true;
                    await userpromotionremove(department, role, id);
                    return res.status(200).json({ message: "Depromotion successful." });
                }
            }

            if (!found) {
                return res.status(400).json({ error: `This user is not a ${role} in ${department}.` });
            }

        } else if (type === "save") {
            const result = await addTeamToUser(id, department, role);
            return res.status(200).json(result);
        } else {
            return res.status(400).json({ error: "Invalid type. Expected 'remove' or 'save'." });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Unexpected error occurred." });
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

 async function userpromotionremove(department, role, id) {
    try {
        const updatedUser = await Userinfo.findByIdAndUpdate(
            id,
            {
                $pull: {
                    teams: { teamName: department, roles: role },
                },
            },
            { new: true }
        );

        if (!updatedUser) {
            return { error: "User not found or update failed." };
        }

        return { message: "Depromotion successful." };
    } catch (error) {
        throw new Error('Error during user promotion removal: ' + error.message);
    }
}

async function addTeamToUser(userId, teamName, roles) {
    try {
        // Check if user already holds the same position
        const user = await Userinfo.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        // Check if user already has the same department and role
        const existingTeam = user.teams.find(
            team => team.teamName === teamName && team.roles === roles
        );

        if (existingTeam) {
            return { error: "This user already holds this position." }; // Error if user is already part of the team with the same role
        }

        // Add the team if not already assigned
        const updatedUser = await Userinfo.findByIdAndUpdate(
            userId,
            { $push: { teams: { teamName: teamName, roles: roles } } },
            { new: true }
        );

        if (!updatedUser) {
            throw new Error('Error updating user with new team.');
        }

        return { message: "Promotion successful." };
    } catch (error) {
        throw new Error('Error adding team to user: ' + error.message);
    }
}