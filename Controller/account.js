const Account = require('../models/account.js');


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
      console.log ( account[0].transactions)
        return res.render("account/accounts.ejs", { acc: account[0].balance, details: account[0].transactions });
        
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error fetching account');
        return res.redirect('/error');
    }
    
}

