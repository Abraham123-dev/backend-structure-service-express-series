const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    googleId: { 
        type: String,
         required: true,
          unique: true
         },

    name: { 
        type: String,
         required: true
         },

    email: { 
        type: String,
        required: true,
        unique: true,
    },

    avatar: {   
        type: String,
    },

    role: {
        type: String,
        enum: ['student', "instructor", "admin"],
        default: 'student',
    },

    uploadcount: {
        type: Number,
        default: 0,
    },

    lastUpload: {
        type: Date,
        default: null,
    }
}, { timestamps: true });
 
const User = mongoose.model('User', userSchema);

module.exports = User;
