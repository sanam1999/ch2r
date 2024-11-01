const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userInfoSchema = new Schema({
    firstName: String,
   
    lastName: String,
    faculty: {
        type: String,
        enum: [
            'Faculty of Information Technology (IT)',
            'Faculty of Business and Management',
            'Faculty of Science',
            'Faculty of Law',
            'Faculty of Education',
            'Other',
        ],
    },
    yearOfStudy: {
        type: String,
        enum: ['First Year', 'Second Year', 'Third Year', 'Final Year'],
    },
    degreeProgram: String,
    studentID: String,
    phoneNumber: String,
    whatsappNumber: String,
    dateOfBirth: Date,
    address: {
        street: String,
        city: String,
    },
    cybersecurityInterests: {
        type: [String],
        enum: [
            'Network Security',
            'Ethical Hacking',
            'Cloud Security',
            'Forensics',
            'Privacy and Data Protection',
            'Other',
        ],
    },
    cybersecuritySkills: [String],
    certifications: {
        hasCertifications: Boolean,
        list: [String],
    },
    img: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    },
    likedPosts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    dislikedPosts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
}, { timestamps: true });

module.exports = mongoose.model('UserInfo', userInfoSchema);
