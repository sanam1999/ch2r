const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'boardMember', 'admin'],
        default: 'user',
    },
    userInfo: {
        type: Schema.Types.ObjectId,
        ref: 'UserInfo',
    }
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
