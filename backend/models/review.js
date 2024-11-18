const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
    },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
