const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: [{
        url: String,
    }],
    location: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
    }],
    likes: {
        type: Number,
        default: 0,
    }, 
    likedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
    }],
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
