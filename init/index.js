const mongoose = require('mongoose');
const Account = require("../models/account.js");

const mongolink = "mongodb://localhost:27017/C2sh";

async function main() {
    await mongoose.connect(mongolink);
    console.log("Connection successful");

    await initDB();
}

const initDB = async () => {
   await Account.deleteMany();
    let account = new Account({
        balance: 0,
        transactions: []
    });
    await Account.create(account); // Use create() instead of insert()
};

main().catch(err => console.log(err));
